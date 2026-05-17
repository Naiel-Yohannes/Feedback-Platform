import { useNavigate } from "react-router-dom"

const LandingPage = () => {
    const navigate = useNavigate()

    return (
        <div className="page-shell relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.06)_0%,_transparent_50%)]" aria-hidden="true" />
            <div className="relative w-full max-w-lg text-center">
                <p className="text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase">Feedback Platform</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    Collect feedback that matters
                </h1>
                <p className="mt-4 text-base leading-relaxed text-zinc-400">
                    Simple surveys for coordinators and teams. Publish, respond, and review results in one place.
                </p>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button type="button" className="btn-primary" onClick={() => navigate('/register')}>
                        Create account
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => navigate('/login')}>
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
