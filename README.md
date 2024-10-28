# mariadb-backup-s3

CLI for taking mariadb backup and upload the result to an S3 bucket.

## Installation / Usage

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
