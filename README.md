# mariadb-backup-s3

CLI for taking mariadb backup and upload the result to an S3 bucket.

[![Badge OSC](https://img.shields.io/badge/Evaluate-24243B?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl8yODIxXzMxNjcyKSIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSI3IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz4KPGRlZnM%2BCjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8yODIxXzMxNjcyIiB4MT0iMTIiIHkxPSIwIiB4Mj0iMTIiIHkyPSIyNCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjQzE4M0ZGIi8%2BCjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iIzREQzlGRiIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM%2BCjwvc3ZnPgo%3D)](https://app.osaas.io/browse/birme-mariadb-backup-s3)

## Installation / Usage

### Eyevinn Open Source Cloud

Install the OSC command line tool (0.15.3+):

```
% npm install -g @osaas/cli
```

Assuming that you have stored the AWS credentials in the secrets `awsaccesskeyid` and `awssecretaccesskey` in Open Source Cloud:

```
% export OSC_ACCESS_TOKEN=<personal-access-token>
% osc create birme-mariadb-backup-s3 demo \
  -o MariaDbUrl="mariadb://root:<rootpwd>@<ip>:<port>/<database>" \
  -o awsAccessKeyId="{{secrets.awsaccesskeyid}}" \
  -o awsSecretAccessKey="{{secrets.awssecretaccesskey}}" \
  -o awsRegion="eu-north-1" \
  -o cmdLineArgs='s3://<s3-bucket-for-backup>/'
```

### Docker

```
docker build -t mariadb-backup-s3:local .
```

```
docker run --rm \
  -e AWS_ACCESS_KEY_ID=<aws-access-key-id> \
  -e AWS_SECRET_ACCESS_KEY=<aws-secret-access-key> \
  -e AWS_REGION=<aws-region> \
  -e DB_URL=mariadb://root:<admin-password>@<host>:<ip>/<database> \
  mariadb-backup-s3:local \
  mariadb-backup-s3 \
  s3://<s3-bucket>/
```

## License

This project is licensed under the MIT License, see [LICENSE](LICENSE).
