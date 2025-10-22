'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { decodeMermaid } from '@/lib/utils';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

function getMermaidCodeFromSearchParams(): string {
  if (typeof window === 'undefined') return '';
  if (!window.location.search) return '';
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('mermaid');
  if (!encoded) return '';
  return decodeMermaid(encoded);
}


export default function IframeMermaidPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = getMermaidCodeFromSearchParams();
    if (!code) {
      setError('No Mermaid code found in URL.');
      return;
    }
    setError(null);
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      mermaid.initialize({ startOnLoad: false });
      mermaid.render('mermaid-diagram', code)
        .then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        })
        .catch((err) => {
          setError('Failed to render diagram: ' + err.message);
        });
    }
  }, []);

  return (
    <Box className="iframe-mermaid-root" sx={{ width: '100%', height: '100%', background: '#fff', p: 2 }}>
      {error ? (
        <Paper elevation={2} sx={{ p: 2, bgcolor: '#ffeaea' }}>
          <Typography color="error" fontWeight="bold">
            {error}
          </Typography>
        </Paper>
      ) : (
        <Box ref={containerRef} className="iframe-mermaid-diagram" sx={{ width: '100%', height: '100%' }} />
      )}
    </Box>
  );
}
