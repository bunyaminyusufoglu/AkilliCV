using System.ComponentModel.DataAnnotations;

namespace AkilliCVBackend.Models
{
    public class LoginUser
    {
        public int Id { get; set; }

      

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}



