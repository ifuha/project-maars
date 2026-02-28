using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Amazon.S3;
using Amazon.S3.Transfer;
using Amazon;

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
          ForcePathStyle = true
        }
      );

      var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
    
      using var stream = file.OpenReadStream();

      var uploadRequest = new TransferUtilityUploadRequest
        {
          InputStream = stream,
          Key = fileName,
          BucketName = bucketName,
          ContentType = file.ContentType
        };
        var transferUtility = new TransferUtility(s3Client);
        await transferUtility.UploadAsync(uploadRequest);
        var url = $"https://{accountId}.r2.cloudflarestorage.com/{bucketName}/{fileName}";
        return Ok(new { url });
    }
}