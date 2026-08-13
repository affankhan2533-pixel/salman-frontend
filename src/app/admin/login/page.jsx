'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@salmanhairstudio.com');
  const [password, setPassword] = useState('admin123password');
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Check if valid token already exists
  useEffect(() => {
    const token = localStorage.getItem('atelier_access_token');
    if (token && token !== 'undefined' && token !== 'null') {
      router.push('/admin');
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const API_URL = rawUrl.replace(/\/api\/?$/, '');
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      const authToken = data.data?.token || data.data?.accessToken;
      if (!authToken) {
        throw new Error('Invalid authentication token response from server.');
      }

      // Store JWT Tokens
      localStorage.setItem('atelier_access_token', authToken);
      if (data.data?.refreshToken) {
        localStorage.setItem('atelier_refresh_token', data.data.refreshToken);
      }
      if (data.data?.user) {
        localStorage.setItem('atelier_user', JSON.stringify(data.data.user));
      }

      router.push('/admin');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#0D0D0D] text-white flex items-center justify-center p-6 font-inter select-none">
      <div className="w-full max-w-md bg-[#161616] border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059] mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-2xl font-normal text-white uppercase tracking-wider">
            Atelier Authentication
          </h1>
          <p className="text-xs text-zinc-400 font-light">
            Production JWT Access for Salman Hair Studio Admin
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <label className="text-[11px] text-zinc-400 uppercase tracking-widest block font-medium">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-[#0D0D0D] border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-zinc-400 uppercase tracking-widest block font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-[#0D0D0D] border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#C5A059] transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-zinc-800 text-[#C5A059]"
              />
              <span>Remember session (7 days)</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#C5A059] hover:bg-[#b08d4b] text-[#0D0D0D] font-medium text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#0D0D0D]" />
                <span>Authenticating JWT...</span>
              </>
            ) : (
              <span>Sign In to Console →</span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
