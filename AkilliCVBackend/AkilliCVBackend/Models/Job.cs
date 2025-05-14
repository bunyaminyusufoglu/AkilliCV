namespace AkilliCVBackend.Models
{
    public class Job
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Skills { get; set; } // İş için gereken yetenekler, virgülle ayrılmış
        public string Company { get; set; }
        public string Location { get; set; }
    }
}