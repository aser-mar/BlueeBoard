import { useState, useEffect, useRef, useMemo } from 'react';
import EGYPT_REGIONS from '../constants/egyptRegions';
import { getSectors } from '../services/sectorService';
import { getCompanies } from '../services/companyService';
import { useTranslation } from 'react-i18next';
import './CompanyFilters.css';

const SearchableDropdown = ({ label, options, value, onChange, placeholder }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset search term when clicking away
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(opt => 
      opt.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const handleSelect = (option) => {
    onChange(option);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="bb-searchable-dropdown" ref={wrapperRef}>
      <label className="bb-dropdown-label">{label}</label>
      <div 
        className="bb-dropdown-input-wrapper"
        onClick={() => setIsOpen(true)}
      >
        <input 
          type="text" 
          className="bb-dropdown-input"
          placeholder={value === 'All' ? placeholder : value}
          value={isOpen ? searchTerm : (value === 'All' ? '' : value)}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        <span className="bb-dropdown-arrow">▼</span>
      </div>
      
      {isOpen && (
        <ul className="bb-dropdown-list">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, idx) => (
              <li 
                key={idx} 
                className={`bb-dropdown-item ${opt === value ? 'selected' : ''}`}
                onClick={() => handleSelect(opt)}
              >
                {opt === 'All' ? t("common.all") : opt}
              </li>
            ))
          ) : (
            <li className="bb-dropdown-empty">{t("filters.noResults")}</li>
          )}
        </ul>
      )}
    </div>
  );
};

const CompanyFilters = ({ onFilterChange, companies }) => {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedGovernorate, setSelectedGovernorate] = useState("All");
  const [selectedSector, setSelectedSector] = useState("All");
  const [companySearch, setCompanySearch] = useState("");
  const [sectors, setSectors] = useState([]);
  // Separate unfiltered company list for deriving available dropdown options
  // (companies prop is already-filtered, so we can't use it for options derivation)
  const [allCompaniesForOptions, setAllCompaniesForOptions] = useState([]);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const data = await getSectors();
        setSectors(data || []);
      } catch (err) {
        console.error("Failed to fetch sectors", err);
      }
    };
    fetchSectors();
  }, []);

  // Fetch ALL companies (no filters) once on mount to power the dropdown options.
  // This is independent of the filtered `companies` prop so options never shrink
  // as the user applies filters (which would create a compounding-filter UX bug).
  useEffect(() => {
    const fetchAllCompanies = async () => {
      try {
        const data = await getCompanies();
        setAllCompaniesForOptions(data || []);
      } catch (err) {
        console.error("Failed to fetch all companies for filter options", err);
      }
    };
    fetchAllCompanies();
  }, []);

  const handleCompanySearchChange = (value) => {
    setCompanySearch(value);

    const trimmedValue = value.trim();
    if (!trimmedValue || !companies || companies.length === 0) {
      return;
    }

    const matches = companies.filter((company) =>
      company.name.toLowerCase().includes(trimmedValue.toLowerCase())
    );

    if (matches.length === 0) {
      return;
    }

    const firstMatch = matches[0];

    if (firstMatch.region?.length > 0) {
      setSelectedRegion(firstMatch.region[0]);
    }

    if (firstMatch.governorates?.length > 0) {
      setSelectedGovernorate(firstMatch.governorates[0]);
    }
  };

  // Sync state upward when any filter changes
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        region: selectedRegion,
        governorate: selectedGovernorate,
        sector: selectedSector,
        search: companySearch
      });
    }
  }, [selectedRegion, selectedGovernorate, selectedSector, companySearch, onFilterChange]);

  // Build a Set of region names that have at least one company
  const populatedRegions = useMemo(() => {
    const set = new Set();
    allCompaniesForOptions.forEach(c => {
      if (Array.isArray(c.region)) {
        c.region.forEach(r => { if (r) set.add(r); });
      }
    });
    return set;
  }, [allCompaniesForOptions]);

  // Build a Set of governorate names that have at least one company
  const populatedGovernorates = useMemo(() => {
    const set = new Set();
    allCompaniesForOptions.forEach(c => {
      if (Array.isArray(c.governorates)) {
        c.governorates.forEach(g => { if (g) set.add(g); });
      }
    });
    return set;
  }, [allCompaniesForOptions]);

  // Derive Region Options — only regions that (a) exist in EGYPT_REGIONS and
  // (b) have at least one company in the unfiltered list
  const regionOptions = useMemo(() => {
    const available = EGYPT_REGIONS
      .map(r => r.region)
      .filter(r => populatedRegions.has(r));
    return ["All", ...available];
  }, [populatedRegions]);

  // Derive Governorate Options — only governorates with at least one company;
  // when a region is selected, also filtered to that region's governorates
  const governorateOptions = useMemo(() => {
    let candidates;
    if (selectedRegion === "All") {
      // All governorates across all regions that have companies
      candidates = EGYPT_REGIONS.flatMap(r => r.governorates);
    } else {
      // Only governorates belonging to the selected region
      const region = EGYPT_REGIONS.find(r => r.region === selectedRegion);
      candidates = region ? region.governorates : [];
    }
    const available = candidates.filter(g => populatedGovernorates.has(g));
    return ["All", ...available];
  }, [selectedRegion, populatedGovernorates]);

  // Derive Sector Options
  const sectorOptions = ["All", ...sectors.map(s => s.name)];

  const currentSectorName = selectedSector === "All" 
    ? "All" 
    : sectors.find(s => s._id === selectedSector)?.name || "All";

  // Handlers
  const handleRegionChange = (newRegion) => {
    setSelectedRegion(newRegion);
    if (newRegion === "All") {
      setSelectedGovernorate("All");
    } else {
      // Check if current governorate belongs to new region
      const region = EGYPT_REGIONS.find(r => r.region === newRegion);
      if (region && selectedGovernorate !== "All" && !region.governorates.includes(selectedGovernorate)) {
        setSelectedGovernorate("All");
      }
    }
  };

  const handleGovernorateChange = (newGov) => {
    setSelectedGovernorate(newGov);
    if (newGov !== "All") {
      // Auto-set region when a governorate is selected
      const parentRegion = EGYPT_REGIONS.find(r => r.governorates.includes(newGov));
      if (parentRegion) {
        setSelectedRegion(parentRegion.region);
      }
    }
  };

  return (
    <div className="bb-company-filters">
      <div className="bb-filters-row">
        <SearchableDropdown 
          label={t("filters.region")}
          options={regionOptions}
          value={selectedRegion}
          onChange={handleRegionChange}
          placeholder={t("filters.allRegions")}
        />
        <SearchableDropdown 
          label={t("filters.governorate")}
          options={governorateOptions}
          value={selectedGovernorate}
          onChange={handleGovernorateChange}
          placeholder={t("filters.allGovernorates")}
        />
        {sectors.length > 0 && (
          <SearchableDropdown 
            label={t("filters.sector")}
            options={sectorOptions}
            value={currentSectorName}
            onChange={(name) => {
              if (name === "All") {
                setSelectedSector("All");
              } else {
                const s = sectors.find(sect => sect.name === name);
                if (s) setSelectedSector(s._id);
              }
            }}
            placeholder={t("filters.allSectors")}
          />
        )}
        <div className="bb-search-wrapper">
          <label className="bb-dropdown-label">{t("filters.searchCompany")}</label>
          <input 
            type="text" 
            className="bb-search-input bb-dropdown-input"
            placeholder={t("filters.searchPlaceholder")}
            value={companySearch}
            onChange={(e) => handleCompanySearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyFilters;
