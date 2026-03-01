using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Amazon.S3;
using Amazon.S3.Model;

namespace Api.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IConfiguration _config;

    public UploadController(IConfiguration config)
    {
        _config = config;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult> Upload(IFormFile file)
    {
        var bucketName = _config["R2:BucketName"];
        var accountId = _config["R2:AccountId"];
        var accessKeyId = _config["R2:AccessKeyId"];
        var secretAccessKey = _config["R2:SecretAccessKey"];

        var s3Client = new AmazonS3Client(
            accessKeyId,
            secretAccessKey,
            new AmazonS3Config
            {
                ServiceURL = $"https://{accountId}.r2.cloudflarestorage.com",
                ForcePathStyle = true,
            }
        );

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

        using var stream = file.OpenReadStream();
        var request = new PutObjectRequest
        {
            BucketName = bucketName,
            Key = fileName,
            InputStream = stream,
            ContentType = file.ContentType,
            DisablePayloadSigning = true
        };

        await s3Client.PutObjectAsync(request);

        var url = $"https://pub-be646ec5183a4105a22a3ba4770c0bd9.r2.dev/{fileName}";
        return Ok(new { url });
    }
}