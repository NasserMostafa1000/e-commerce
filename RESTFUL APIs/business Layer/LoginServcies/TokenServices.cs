using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using StoreDataAccessLayer.Entities;

public class TokenService
{
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config)
    {
        _config = config;
    }
    private string GetRoleName(byte RoleId)
    {
        string[] roleNames = { "Admin", "Manager", "User","Shipping Manager" };
        return roleNames[RoleId - 1];
    }
    public string CreateToken(Users user)
    {        var key = _config["JwtSettings:Key"];
        var issuer = _config["JwtSettings:Issuer"];
        var audience = _config["JwtSettings:Audience"];

        if (string.IsNullOrEmpty(key))
        {
            throw new Exception("JWT Key is missing in configuration.");
        }

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()), // معرف المستخدم
            new Claim(JwtRegisteredClaimNames.Email, user.EmailOrAuthId), // البريد الإلكتروني
            new Claim(ClaimTypes.Role, GetRoleName(byte.Parse(user.RoleId.ToString()))), // دور المستخدم
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()) // معرف التوكن

        };

        // تحويل المفتاح إلى `SymmetricSecurityKey`
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        // إعداد التوكن
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(12),
            SigningCredentials = credentials,
            Issuer = issuer,
            Audience = audience
        };

        // إنشاء التوكن
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}
