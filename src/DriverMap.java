/*
 * @class DriverMap
 * @description Demonstrates Map Side Join operation
 * 
 * execution hadoop jar MapSideJoin.jar /Spring2014_HW-1/input_HW-1/ratings.dat /tmp/pxc130230/MapSideJoin
 * 
 * @author pxc130230 (Praveen Ram Chandiran)
 * 
 */

import java.net.URI;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.filecache.DistributedCache;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;

public class DriverMap extends Configured implements Tool {
	private final static String PATH = "/Spring2014_HW-1/input_HW-1/users.dat";

	@Override
	public int run(String[] args) throws Exception {
		if (args.length != 2) {
			System.out.println("");
			return -1;
		}

		Job job = new Job(getConf());
		Configuration configuration = job.getConfiguration();
		job.setJobName("Map Side Join with Distributed Cache");

		DistributedCache.addCacheFile(new URI(PATH), configuration);

		job.setJarByClass(DriverMap.class);
		job.setMapperClass(MapSideJoin.class);

		FileInputFormat.setInputPaths(job, new Path(args[0]));
		FileOutputFormat.setOutputPath(job, new Path(args[1]));

		job.setNumReduceTasks(0);

		boolean success = job.waitForCompletion(true);
		return success ? 0 : 1;
	}

	public static void main(String[] args) throws Exception {
		int exitCode = ToolRunner.run(new Configuration(), new DriverMap(),
				args);
		System.exit(exitCode);
	}
}
