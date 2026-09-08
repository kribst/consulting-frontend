import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { ArrowUp } from 'lucide-react';
import './ScrollTop.css';

export default function ScrollTop({ threshold = 200 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.pageYOffset > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <a
      href="#top"
      onClick={handleClick}
      className={`scroll-top d-flex align-items-center justify-content-center${visible ? ' active' : ''}`}
      aria-label="Remonter en haut"
    >
      <ArrowUp size={22} color="#fff" strokeWidth={3} className="scroll-top-arrow" />
    </a>
  );
}