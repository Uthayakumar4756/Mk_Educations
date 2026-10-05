// data-loader.js - Loads all JSON table data
class DataLoader {
  static cache = {};

  static async loadJSON(path) {
    if (this.cache[path]) return this.cache[path];
    try {
      const res = await fetch(path);
      const data = await res.json();
      this.cache[path] = data;
      return data;
    } catch (e) {
      console.error(`Failed to load ${path}`, e);
      return [];
    }
  }

  static async getTNEA() { return this.loadJSON('data/tnea-cutoff.json'); }
  static async getEntrance() { return this.loadJSON('data/entrance-exams.json'); }
  static async getScholarships() { return this.loadJSON('data/scholarships.json'); }
  static async getQuiz() { return this.loadJSON('data/quiz-questions.json'); }
  static async getCourses() { return this.loadJSON('data/courses.json'); }
  static async getNav() { return this.loadJSON('data/nav-links.json'); }
}

window.DataLoader = DataLoader;
