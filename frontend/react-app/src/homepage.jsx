import Navbar from './Navbar';
import './css/homepage.css';

const Homepage = () => {
  const featuredProblems = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', acceptance: '58%' },
    { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', acceptance: '42%' },
    { id: 3, title: 'Longest Substring', difficulty: 'Medium', acceptance: '35%' },
    { id: 4, title: 'Median of Arrays', difficulty: 'Hard', acceptance: '28%' }
  ];

  return (
    <div className="app">
      <Navbar />
      <div className="homepage-container">
        <section className="hero">
  <div className="hero-content">
    <h1>Sharpen Your Coding Skills</h1>
    <p>
     Practice with curated problems to ace your next technical interview
    </p>
  </div>
</section>


        {/* ✅ Featured Problems Table */}
        <section className="featured-problems">
          <h2>Featured Problems</h2>
          <div className="problems-table-wrapper">
            <table className="problems-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Difficulty</th>
                  <th>Acceptance</th>
                </tr>
              </thead>
              <tbody>
                {featuredProblems.map((problem) => (
                  <tr key={problem.id}>
                    <td>{problem.id}</td>
                    <td>
                      <a href="#" className="problem-link">{problem.title}</a>
                    </td>
                    <td className={`difficulty ${problem.difficulty.toLowerCase()}`}>
                      {problem.difficulty}
                    </td>
                    <td>{problem.acceptance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Footer Section */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>CodeJudge</h3>
            <p>
              Helping developers prepare for technical interviews since 2023
              with high-quality coding challenges and interview preparation resources.
            </p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Connect</h3>
            <ul>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">GitHub</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">YouTube</a></li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          © 2023 CodeJudge. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
