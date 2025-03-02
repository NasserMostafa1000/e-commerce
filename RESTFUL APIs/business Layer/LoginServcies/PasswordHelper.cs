using System.Security.Cryptography;
using System.Text;

public static class PasswordHelper
{
    public static string HashPassword(string password, out string salt)
    {
        // إنشاء Salt
        byte[] saltBytes = new byte[16];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(saltBytes);
        }
        salt = Convert.ToBase64String(saltBytes);

        // دمج كلمة المرور مع الـ Salt
        using (var pbkdf2 = new Rfc2898DeriveBytes(password, saltBytes, 10000, HashAlgorithmName.SHA256))
        {
            byte[] hash = pbkdf2.GetBytes(32); // إخراج 32 Byte
            return Convert.ToBase64String(hash);
        }
    }

    public static bool VerifyPassword(string password, string hashedPassword, string salt)
    {
        byte[] saltBytes = Convert.FromBase64String(salt);

        // إعادة حساب الـ Hash باستخدام نفس الـ Salt
        using (var pbkdf2 = new Rfc2898DeriveBytes(password, saltBytes, 10000, HashAlgorithmName.SHA256))
        {
            byte[] hash = pbkdf2.GetBytes(32);
            string computedHash = Convert.ToBase64String(hash);

            // مقارنة الـ Hash المحسوب مع المخزن
            return computedHash == hashedPassword;
        }
    }
    public static string GenerateRandomPassword(int length)
    {
        // مجموعة الأحرف التي يمكن استخدامها في كلمة المرور
        const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";

        StringBuilder password = new StringBuilder();
        Random random = new Random();

        // إنشاء كلمة مرور عشوائية من الأحرف المتاحة
        for (int i = 0; i < length; i++)
        {
            int index = random.Next(validChars.Length);  // اختيار فهرس عشوائي
            password.Append(validChars[index]);  // إضافة الحرف العشوائي إلى كلمة المرور
        }

        return password.ToString();
    }
}

