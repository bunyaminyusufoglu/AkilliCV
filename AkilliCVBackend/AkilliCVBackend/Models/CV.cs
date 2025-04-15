namespace AkilliCVBackend.Models
{
    public class CV
    {
        public int Id { get; set; }
        public int UserId { get; set; }  // Kullanıcıyla ilişkilendiriyoruz
        public string FilePath { get; set; }  // Dosyanın kaydedileceği yol
        public string FileName { get; set; }  // Dosya adı
        public DateTime UploadDate { get; set; }  // Yükleme tarihi
    }
}
