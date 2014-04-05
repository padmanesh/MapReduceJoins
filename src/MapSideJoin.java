/*
* @class MapSideJoin
* @description Demonstrates Map Side Join operation
* ratings.dat goes into distributed cache and users.dat will be provided as i/p
* 
* execution hadoop jar MapSideJoin.jar /Spring2014_HW-1/input_HW-1/ratings.dat /tmp/pxc130230/MapSideJoin
* 
* @author pxc130230 (Praveen Ram Chandiran)
* 
* For my reference
* 8::M::25::12::11413
* UserID::Gender::Age::Occupation::Zip-code
*/

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Comparator;
import java.util.HashMap;
import java.util.TreeMap;

import org.apache.hadoop.filecache.DistributedCache;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.NullWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

public class MapSideJoin extends Mapper<LongWritable, Text, IntWritable, Text> {

	private static final String DELIMITER = "::";
	private static final int ONE = 1;
	private Text key = new Text();

	private BufferedReader brReader;

	private HashMap<Integer, String> userMap = new HashMap<Integer, String>();
	private HashMap<Integer, Integer> userRating = new HashMap<Integer, Integer>();
	private IntegerComparator integerComparator = new IntegerComparator(userRating);
	private TreeMap<Integer, Integer> userRatingSorted = new TreeMap<Integer, Integer>(
			integerComparator);

	@Override
	protected void setup(Context context) throws IOException,
			InterruptedException {
		Path[] cacheFilesLocal = DistributedCache.getLocalCacheFiles(context
				.getConfiguration());

		for (Path eachPath : cacheFilesLocal) {
			if (eachPath.getName().toString().trim().equals("users.dat")) {
				buildUserHashMap(eachPath, context);
			}
		}
	}
	
	/*
	 * Creates a HashMap with user id as key and value is result of the concatenation
	 * of age and gender field
	 */

	private void buildUserHashMap(Path filePath, Context context)
			throws IOException {

		String line = null;

		try {
			brReader = new BufferedReader(new FileReader(filePath.toString()));

			while ((line = brReader.readLine()) != null) {
				String newline = line.toString();
				String userDatArray[] = newline.split(DELIMITER);
				int userId = Integer.parseInt(userDatArray[0]);
				String value = userDatArray[2] + "\t" + userDatArray[1] + "";
				userMap.put(userId, value);
			}

		} catch (FileNotFoundException e) {
			e.printStackTrace();

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (brReader != null) {
				brReader.close();

			}

		}
	}

	@Override
	public void map(LongWritable key, Text value, Context context)
			throws IOException, InterruptedException {
		if (value.toString().length() > 0) {
			String ratingsDatArray[] = value.toString().split(DELIMITER);
			int userId = Integer.parseInt(ratingsDatArray[0]);

			if (userRating.containsKey(userId)) {
				int ratingcount = userRating.get(userId);
				userRating.put(userId, ratingcount + 1);
			} else {
				userRating.put(userId, ONE);
			}
		}
	}

	@Override
	protected void cleanup(Context context) throws IOException,
			InterruptedException {
		String value = "";
		userRatingSorted.putAll(userRating);
		int counter = 0;
		
		for (Integer key : userRatingSorted.keySet()) {
			if (userMap.containsKey(key)) {
				String rating = String.valueOf(userRating.get(key));
				value = userMap.get(key) + "\t" + rating;
			} else {
				value = "No relevant details found";
			}

			if (counter < 10) {
				context.write(new IntWritable(key), new Text(value));
				counter++;
			}
		}
	}
}

class IntegerComparator implements Comparator<Integer> {

	HashMap<Integer, Integer> tempMap;

	public IntegerComparator(HashMap<Integer, Integer> base) {
		this.tempMap = base;
	}

	public int compare(Integer value1, Integer value2) {
		if (tempMap.get(value1) >= tempMap.get(value2)) {
			System.out.println(value1);
			return -1;
		} else {
			return 1;
		}
	}
}
