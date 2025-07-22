import React from 'react';
import { Accordion, Form } from 'react-bootstrap';



interface FilterSidebarProps {
  filters: {
    types: string[];
    countries: string[];
    priceMin: number;
    priceMax: number;
    onlyInStock: boolean;
  };
  onToggle: (section: 'types' | 'countries', value: string) => void;
  onChange: (key: string, value: any) => void;
  types: string[];
  countries: string[];
  minPrice: number;
  maxPrice: number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onToggle,
  onChange,
  types,
  countries,
}) => {
  return (
    <div className="marketplace-sidebar">
      <Accordion defaultActiveKey={['0', '1', '2', '3']} alwaysOpen>
        {/* Type d'artisanat */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>Type d'artisanat</Accordion.Header>
          <Accordion.Body>
            {types.map((type) => (
              <Form.Check
                key={type}
                label={type}
                checked={filters.types.includes(type)}
                onChange={() => onToggle('types', type)}
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>

        {/* Pays */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>Pays</Accordion.Header>
          <Accordion.Body>
            {countries.map((country) => (
              <Form.Check
                key={country}
                label={country}
                checked={filters.countries.includes(country)}
                onChange={() => onToggle('countries', country)}
              />
            ))}
          </Accordion.Body>
        </Accordion.Item>

        {/* Prix */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>Prix</Accordion.Header>
          <Accordion.Body>
            <Form.Label>Min</Form.Label>
            <Form.Control
              type="number"
              min={50}
              max={2000}
              value={filters.priceMin}
              onChange={(e) => onChange('priceMin', Number(e.target.value))}
              className="mb-2"
            />
            <Form.Label>Max</Form.Label>
            <Form.Control
              type="number"
              min={50}
              max={2000}
              value={filters.priceMax}
              onChange={(e) => onChange('priceMax', Number(e.target.value))}
            />
          </Accordion.Body>
        </Accordion.Item>

        {/* Disponibilité */}
        <Accordion.Item eventKey="3">
          <Accordion.Header>Disponibilité</Accordion.Header>
          <Accordion.Body>
            <Form.Check
              type="switch"
              label="En stock uniquement"
              checked={filters.onlyInStock}
              onChange={(e) => onChange('onlyInStock', e.target.checked)}
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default FilterSidebar;
