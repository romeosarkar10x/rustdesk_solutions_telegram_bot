import * as EC2 from "npm:@aws-sdk/client-ec2";
// import { CloudWatchClient, GetMetricStatisticsCommand } from "npm:@aws-sdk/client-cloudwatch";
import { Config } from "./config.ts";
import Logger from "./logger.ts";

interface InstanceDescription {
    instanceId: string;
    status: string;
    publicIpAddress?: string;
}

class Client extends EC2.EC2Client {
    params: { InstanceIds: string[] };

    constructor(config: Config) {
        const awsConfig: EC2.EC2ClientConfig = {
            region: config.awsRegion,
            credentials: {
                accessKeyId: config.awsAccessKeyId,
                secretAccessKey: config.awsAccessKeySecret,
            },
        };
        super(awsConfig);

        this.params = {
            InstanceIds: [config.awsInstanceId],
        };
    }
    async startInstance(): Promise<void> {
        const output: EC2.StartInstancesCommandOutput = await this.send(new EC2.StartInstancesCommand(this.params));
        Logger.log(JSON.stringify(output));
    }

    async stopInstance(): Promise<void> {
        const output: EC2.StopInstancesCommandOutput = await this.send(new EC2.StopInstancesCommand(this.params));
        Logger.log(JSON.stringify(output));
    }

    async describeInstance(): Promise<InstanceDescription> {
        const output: EC2.DescribeInstancesCommandOutput = await this.send(
            new EC2.DescribeInstancesCommand(this.params),
        );
        Logger.log(JSON.stringify(output));

        const instance: EC2.Instance | undefined = output.Reservations?.at(0)?.Instances?.at(0);
        const instanceId: string | undefined = instance?.InstanceId;
        const status: string | undefined = instance?.State?.Name;

        if (status === "running") {
            const publicIpAddress: string | undefined = instance?.PublicIpAddress;
            return {
                instanceId: instanceId ?? "undefined",
                status,
                publicIpAddress,
            };
        }

        return {
            instanceId: instanceId ?? "undefined",
            status: status ?? "undefined",
        };
    }
}

export { Client };
export type { InstanceDescription };
// const cloudWatchClient = new CloudWatchClient(awsConfig);

// deno run --allow-net --allow-env --allow-read --allow-sys aws.ts
