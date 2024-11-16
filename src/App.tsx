import React, { useState } from 'react';
import { FileText, Loader2, Upload } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from './components/Button';
import { ResumeActions } from './components/ResumeActions';

function App() {
  const [resumeUrl, setResumeUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://8b57sl.buildship.run/generateResumeFromJobDescription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeUrl, jobDescription })
      });
      
      const data = await response.json();
      if (data.markdown) {
        setResult(data.markdown.replace('```markdown\n', '').replace('\n```', ''));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError('Failed to generate resume. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 text-indigo-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Resume Optimizer</h1>
            <p className="text-lg text-gray-600">Tailor your resume to match the job description perfectly</p>
          </header>

          <div className="grid md:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
              <div>
                <label htmlFor="resumeUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Resume URL
                </label>
                <input
                  type="url"
                  id="resumeUrl"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://example.com/resume.pdf"
                  required
                />
              </div>

              <div>
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Paste the job description here..."
                  required
                />
              </div>

              <Button
                type="submit"
                isLoading={loading}
                icon={loading ? Loader2 : Upload}
                className="w-full"
              >
                {loading ? 'Generating...' : 'Generate Optimized Resume'}
              </Button>

              {error && (
                <div className="text-red-600 text-sm mt-2">
                  {error}
                </div>
              )}
            </form>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Generated Resume</h2>
                {result && <ResumeActions markdown={result} />}
              </div>
              
              <div className="overflow-auto max-h-[700px]">
                {result ? (
                  <div className="prose max-w-none">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-12">
                    Your optimized resume will appear here
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;