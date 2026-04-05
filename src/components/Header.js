import React from 'react';
import { useEffect, useState } from 'react';
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

const Header = props => {
  let [toggleMenu, setToggleMenu] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const projects = useSiteProjects().filter(project => Boolean(project?.path && project?.menuLabel));
  const [dropdownLinks, setDropdownLinks] = useState(() => normalizeMenuLinks(menuLinks));

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
            <ul className="z-50 dropdown-menu absolute text-gray-200 py-3 ">
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
                          onMouseEnter={() => setOpenSection(key)}
                          onMouseLeave={() => setOpenSection(null)}
                        >
                          <span className="link px-3 flex items-center justify-between gap-2 cursor-default">
                            {section.name}
                            <span className="section-arrow">›</span>
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
