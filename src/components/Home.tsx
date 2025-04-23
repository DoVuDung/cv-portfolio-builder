import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-gray-100 text-gray-800 p-8">
      <section className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Build Your CV & Portfolio Effortlessly
        </h1>
        <p className="text-lg text-gray-600">
          A modern web app for developers to create, customize and export their CVs or portfolio websites. Powered by Vite, Bun, React, Tailwind and Module Federation.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <Link to="/demo/form/simple">
            <Button size="lg">Start Building</Button>
          </Link>
          <a
            href="https://github.com/DoVuDung/cv-portfolio-builder"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg">
              GitHub
            </Button>
          </a>
        </div>
      </section>

      <section className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4 ">🚀 How to Contribute</h2>
        <ul className="list-disc list-inside text-left text-gray-700 space-y-2">
          <li>Fork the repo and clone it</li>
          <li>Install dependencies with <code>bun install</code></li>
          <li>Start dev server with <code>bun dev</code></li>
          <li>Create a new branch for your feature</li>
          <li>Submit a pull request with a clear description</li>
        </ul>
      </section>
    </main>
  )
}
