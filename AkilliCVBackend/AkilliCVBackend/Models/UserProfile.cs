namespace AkilliCVBackend.Models
{
    public class UserProfile
    {
        public int Id { get; set; }
        public int UserId { get; set; }  // Kullanıcıya ait ID
        public DateTime DateOfBirth { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Education { get; set; }
        public string WorkExperience { get; set; }
        public string Skills { get; set; }
        public string Languages { get; set; }
        public string References { get; set; }
        public string PortfolioLink { get; set; }
        public string DesiredSalary { get; set; }
        public string WorkTypePreference { get; set; }
    }
}
