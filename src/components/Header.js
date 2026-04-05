import React from 'react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
// import { BiHomeSmile } from 'react-icons/bi';
import kamon from '../kamon.png';
import { useSiteProjects } from '../lib/siteProjects';
import { getMenuLinks } from '../lib/sanity';
import menuLinks from '../content/menuLinks.json';

function isExternalHref(href) {
  return /^https?:\/\//i.test(href || '');
}

function normalizeMenuLink(link) {
  if (!link || typeof link !== 'object') {
    return null;
  }

  const id = typeof link.id === 'string' ? link.id.trim() : '';
  const label = typeof link.label === 'string' ? link.label.trim() : '';
  const href = typeof link.href === 'string' ? link.href.trim() : '';

  if (!id || !label || !href) {
    return null;
  }

  return {
    id,
    label,
    href,
    external: Boolean(link.external),
    order: Number.isFinite(Number(link.order)) ? Number(link.order) : null,
  };
}

function normalizeMenuLinks(links) {
  if (!Array.isArray(links)) {
    return [];
  }

  return links
    .map((link, index) => {
      const normalized = normalizeMenuLink(link);
      if (!normalized) {
        return null;
      }

      return {
        ...normalized,
        sourceIndex: index,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const aOrder = a.order ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.order ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
      return a.sourceIndex - b.sourceIndex;
    });
}

function groupProjectsBySection(projects) {
  const sectionMap = new Map();
  const unsectioned = [];

  projects.forEach(project => {
    const section = project.menuSection;
    if (!section || !section.name) {
      unsectioned.push(project);
      return;
    }
    const key = section._id || section.name;
    if (!sectionMap.has(key)) {
      sectionMap.set(key, { section, projects: [] });
    }
    sectionMap.get(key).projects.push(project);
  });

  const sortedSections = Array.from(sectionMap.values()).sort((a, b) => {
    const aRank = a.section.orderRank || '';
    const bRank = b.section.orderRank || '';
    if (aRank < bRank) return -1;
    if (aRank > bRank) return 1;
    return 0;
  });

  return { sortedSections, unsectioned };
}

// Builds an SVG path around the combined dropdown + flyout outline.
// All convex corners use sweep=1 (CW small arc).
// Concave junctions also use sweep=1 — the center sits at the junction point,
// so the arc bulges outward into the void between the two panels.
function buildMenuPath({ dW, dH, sY, fW, fH }, r, rc) {
  if (sY === null || fW === 0) {
    return [
      `M ${r} 0`, `L ${dW - r} 0`,
      `A ${r} ${r} 0 0 1 ${dW} ${r}`,
      `L ${dW} ${dH - r}`,
      `A ${r} ${r} 0 0 1 ${dW - r} ${dH}`,
      `L ${r} ${dH}`,
      `A ${r} ${r} 0 0 1 0 ${dH - r}`,
      `L 0 ${r}`,
      `A ${r} ${r} 0 0 1 ${r} 0`, 'Z',
    ].join(' ');
  }

  const flyoutBottom = sY + fH;
  const safeTop = Math.max(rc + r, sY);
  const flushThreshold = 2 * (r + rc);

  if (Math.abs(flyoutBottom - dH) < flushThreshold) {
    // Case 3: flyout bottom ≈ dropdown bottom — flush, no bottom junction
    return [
      `M ${r} 0`, `L ${dW - r} 0`,
      `A ${r} ${r} 0 0 1 ${dW} ${r}`,
      `L ${dW} ${safeTop - rc}`,
      `A ${rc} ${rc} 0 0 0 ${dW + rc} ${safeTop}`,      // concave top junction
      `L ${dW + fW - r} ${safeTop}`,
      `A ${r} ${r} 0 0 1 ${dW + fW} ${safeTop + r}`,
      `L ${dW + fW} ${dH - r}`,
      `A ${r} ${r} 0 0 1 ${dW + fW - r} ${dH}`,
      `L ${r} ${dH}`,
      `A ${r} ${r} 0 0 1 0 ${dH - r}`,
      `L 0 ${r}`,
      `A ${r} ${r} 0 0 1 ${r} 0`, 'Z',
    ].join(' ');
  }

  if (flyoutBottom <= dH) {
    // Case 1: flyout fits within dropdown height
    const safeBottom = Math.min(dH - r - rc, flyoutBottom);
    return [
      `M ${r} 0`, `L ${dW - r} 0`,
      `A ${r} ${r} 0 0 1 ${dW} ${r}`,
      `L ${dW} ${safeTop - rc}`,
      `A ${rc} ${rc} 0 0 0 ${dW + rc} ${safeTop}`,      // concave top junction
      `L ${dW + fW - r} ${safeTop}`,
      `A ${r} ${r} 0 0 1 ${dW + fW} ${safeTop + r}`,
      `L ${dW + fW} ${safeBottom - r}`,
      `A ${r} ${r} 0 0 1 ${dW + fW - r} ${safeBottom}`,
      `L ${dW + rc} ${safeBottom}`,
      `A ${rc} ${rc} 0 0 0 ${dW} ${safeBottom + rc}`,   // concave bottom junction
      `L ${dW} ${dH - r}`,
      `A ${r} ${r} 0 0 1 ${dW - r} ${dH}`,
      `L ${r} ${dH}`,
      `A ${r} ${r} 0 0 1 0 ${dH - r}`,
      `L 0 ${r}`,
      `A ${r} ${r} 0 0 1 ${r} 0`, 'Z',
    ].join(' ');
  } else {
    // Case 2: flyout extends below dropdown
    return [
      `M ${r} 0`, `L ${dW - r} 0`,
      `A ${r} ${r} 0 0 1 ${dW} ${r}`,
      `L ${dW} ${safeTop - rc}`,
      `A ${rc} ${rc} 0 0 0 ${dW + rc} ${safeTop}`,      // concave top junction
      `L ${dW + fW - r} ${safeTop}`,
      `A ${r} ${r} 0 0 1 ${dW + fW} ${safeTop + r}`,
      `L ${dW + fW} ${flyoutBottom - r}`,
      `A ${r} ${r} 0 0 1 ${dW + fW - r} ${flyoutBottom}`,
      `L ${dW + r} ${flyoutBottom}`,
      `A ${r} ${r} 0 0 1 ${dW} ${flyoutBottom - r}`,    // flyout bottom-left convex
      `L ${dW} ${dH + rc}`,
      `A ${rc} ${rc} 0 0 0 ${dW - rc} ${dH}`,          // concave bottom junction
      `L ${r} ${dH}`,
      `A ${r} ${r} 0 0 1 0 ${dH - r}`,
      `L 0 ${r}`,
      `A ${r} ${r} 0 0 1 ${r} 0`, 'Z',
    ].join(' ');
  }
}

function MenuBorderSVG({ dims }) {
  if (typeof window === 'undefined' || !dims) return null;
  const R = 8;   // convex radius px — matches --dropdown-radius: 0.5rem
  const RC = 8;  // concave junction radius px
  const { dW, dH, sY, fW, fH } = dims;
  const totalW = sY !== null && fW > 0 ? dW + fW : dW;
  const totalH = sY !== null && fH > 0 ? Math.max(dH, sY + fH) : dH;
  const d = buildMenuPath(dims, R, RC);
  return (
    <svg
      style={{
        position: 'absolute', top: 0, left: 0,
        width: totalW, height: totalH,
        pointerEvents: 'none', zIndex: -1, overflow: 'visible',
      }}
    >
      <defs>
        <linearGradient id="menu-border-grad" gradientUnits="userSpaceOnUse"
          x1="0" y1="0" x2="0" y2="40">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="#D1D5DB" />
        </linearGradient>
      </defs>
      <path d={d} fill="rgba(0,0,0,0.85)" stroke="url(#menu-border-grad)" strokeWidth="1" />
    </svg>
  );
}

const Header = props => {
  let [toggleMenu, setToggleMenu] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [borderDims, setBorderDims] = useState(null);
  const dropdownRef = useRef(null);
  const baseDimsRef = useRef(null);
  const projects = useSiteProjects().filter(project => Boolean(project?.path && project?.menuLabel));
  const [dropdownLinks, setDropdownLinks] = useState(() => normalizeMenuLinks(menuLinks));

  useLayoutEffect(() => {
    if (!toggleMenu || !dropdownRef.current) {
      setBorderDims(null);
      baseDimsRef.current = null;
      return;
    }
    const dropdown = dropdownRef.current;
    const ddRect = dropdown.getBoundingClientRect();
    if (ddRect.height === 0) { setBorderDims(null); return; }

    // Capture base dimensions once when dropdown first opens (no section hovered)
    if (!baseDimsRef.current) {
      baseDimsRef.current = { dW: ddRect.width, dH: ddRect.height };
    }
    const { dW, dH } = baseDimsRef.current;

    if (!openSection) {
      setBorderDims({ dW, dH, sY: null, fW: 0, fH: 0 });
      return;
    }

    const sectionEl = dropdown.querySelector(`[data-section-key="${openSection}"]`);
    const flyoutEl = sectionEl?.querySelector('.section-submenu');
    if (!sectionEl || !flyoutEl) {
      setBorderDims({ dW, dH, sY: null, fW: 0, fH: 0 });
      return;
    }

    const secRect = sectionEl.getBoundingClientRect();
    const flyRect = flyoutEl.getBoundingClientRect();
    setBorderDims({
      dW,
      dH,
      sY: secRect.top - ddRect.top,
      fW: flyRect.width,
      fH: flyRect.height,
    });
  }, [toggleMenu, openSection]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const sanityLinks = await getMenuLinks();
        const normalizedLinks = normalizeMenuLinks(sanityLinks);
        if (mounted && normalizedLinks.length > 0) {
          setDropdownLinks(normalizedLinks);
        }
      } catch (_err) {
        // Keep local fallback links when Sanity is unavailable.
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <h1 className="relative z-20 flex items-center xl:text-2xl 2xl:text-4xl" style={{ transform: 'translateY(15px)' }}>
      <Link to="/about" className="logo-anchor">
        <img src={kamon} className="kamon" alt="logo" />
      </Link>
      <div className="inline-flex items-center divide-x-2 divide-white ml-1 xl:ml-2">
        {/* DROPDOWN MENU */}
        <div
          id="menu"
          className=" inline-block dropdown z-50"
          onMouseEnter={() => {
            setToggleMenu(true);
          }}
          onMouseLeave={() => {
            setToggleMenu(false);
          }}
        >
          <span className="px-3">Projects</span>
          {toggleMenu && (
            <ul ref={dropdownRef} className="z-50 dropdown-menu absolute text-gray-200 py-3 ">
              <MenuBorderSVG dims={borderDims} />
              {(() => {
                const { sortedSections, unsectioned } = groupProjectsBySection(projects);
                return (
                  <>
                    {sortedSections.map(({ section, projects: sectionProjects }) => {
                      const key = section._id || section.name;
                      const isOpen = openSection === key;
                      return (
                        <li
                          key={key}
                          className="section-item relative"
                          data-section-key={key}
                          onMouseEnter={() => setOpenSection(key)}
                          onMouseLeave={() => setOpenSection(null)}
                        >
                          <span className="link px-3 flex items-center cursor-default section-label">
                            {section.name}
                            <span className="section-arrow">&#x2192;</span>
                          </span>
                          {isOpen && (
                            <ul className="section-submenu dropdown-menu text-gray-200 py-3">
                              {sectionProjects.map(project => (
                                <li
                                  key={`${project.id}-${project.path}`}
                                  onClick={() => { setToggleMenu(false); setOpenSection(null); }}
                                >
                                  {isExternalHref(project.path) ? (
                                    <a className="link px-3" href={project.path} target="_blank" rel="noopener noreferrer">
                                      {project.menuLabel}
                                    </a>
                                  ) : (
                                    <Link className="link px-3" to={project.path}>
                                      {project.menuLabel}
                                    </Link>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                    {unsectioned.map(project => (
                      <li
                        key={`${project.id}-${project.path}`}
                        onClick={() => { setToggleMenu(false); setOpenSection(null); }}
                      >
                        {isExternalHref(project.path) ? (
                          <a className="link px-3" href={project.path} target="_blank" rel="noopener noreferrer">
                            {project.menuLabel}
                          </a>
                        ) : (
                          <Link className="link px-3" to={project.path}>
                            {project.menuLabel}
                          </Link>
                        )}
                      </li>
                    ))}
                  </>
                );
              })()}
              {dropdownLinks.map(link => (
                <li
                  key={link.id}
                  onClick={() => { setToggleMenu(false); setOpenSection(null); }}
                >
                  {link.external || isExternalHref(link.href) ? (
                    <a className="link px-3" href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  ) : (
                    <Link className="link px-3" to={link.href}>
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* END DROPDOWN MENU https://codepen.io/huphtur/pen/ordMeN */}
        <Link className="px-3" to="/gallery">
          Gallery
        </Link>
        <Link className="px-3" to="/about">
          About
        </Link>
      </div>
    </h1>
  );
};

export default Header;
