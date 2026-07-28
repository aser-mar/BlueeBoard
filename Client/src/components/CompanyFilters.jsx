import React, { useState, useEffect, useRef, useMemo } from 'react';
import EGYPT_REGIONS from '../constants/egyptRegions';
import { getSectors } from '../services/sectorService';
import './CompanyFilters.css';

const SearchableDropdown = ({ label, options, value, onChange, placeholder }) => {
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
                {opt}
              </li>
            ))
          ) : (
            <li className="bb-dropdown-empty">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

const CompanyFilters = ({ onFilterChange, companies }) => {
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedGovernorate, setSelectedGovernorate] = useState("All");
  const [selectedSector, setSelectedSector] = useState("All");
  const [companySearch, setCompanySearch] = useState("");
  const [sectors, setSectors] = useState([]);

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

  // Local auto-select effect based on search
  useEffect(() => {
    if (companySearch.trim() && companies && companies.length > 0) {
      const matches = companies.filter(c => c.name.toLowerCase().includes(companySearch.toLowerCase()));
      if (matches.length > 0) {
        const firstMatch = matches[0];
        if (firstMatch.region?.length > 0) {
          setSelectedRegion(firstMatch.region[0]);
        }
        if (firstMatch.governorates?.length > 0) {
          setSelectedGovernorate(firstMatch.governorates[0]);
        }
      }
    }
  }, [companySearch, companies]);

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

  // Derive Region Options
  const regionOptions = ["All", ...EGYPT_REGIONS.map(r => r.region)];
  
  // Derive Governorate Options
  const governorateOptions = useMemo(() => {
    let govs = [];
    if (selectedRegion === "All") {
      govs = EGYPT_REGIONS.flatMap(r => r.governorates);
    } else {
      const region = EGYPT_REGIONS.find(r => r.region === selectedRegion);
      if (region) {
        govs = region.governorates;
      }
    }
    return ["All", ...govs];
  }, [selectedRegion]);

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
          label="Region"
          options={regionOptions}
          value={selectedRegion}
          onChange={handleRegionChange}
          placeholder="All Regions"
        />
        <SearchableDropdown 
          label="Governorate"
          options={governorateOptions}
          value={selectedGovernorate}
          onChange={handleGovernorateChange}
          placeholder="All Governorates"
        />
        <SearchableDropdown 
          label="Sector"
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
          placeholder="All Sectors"
        />
        <div className="bb-search-wrapper">
          <label className="bb-dropdown-label">Search Company</label>
          <input 
            type="text" 
            className="bb-search-input bb-dropdown-input"
            placeholder="Search by name..."
            value={companySearch}
            onChange={(e) => setCompanySearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyFilters;
