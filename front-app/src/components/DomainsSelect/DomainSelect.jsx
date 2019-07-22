import React from "react";
import PropTypes from "prop-types";

import style from "./DomainSelect.scss";

const DomainsSelect = props => {
  const { domains, selectedDomain, onChange } = props;
  const onDomainChange = event => {
    const { value } = event.target;
    onChange(domains.find(domain => domain.name === value));
  };

  return (
    <div className={style.domain_select__container}>
      <div style={{ position: "relative" }}>
        <select
          name="domain"
          value={selectedDomain.name}
          onChange={onDomainChange}
        >
          {domains.map(domain => (
            <option key={domain.id} value={domain.name}>
              {domain.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

DomainsSelect.defaultProps = {};

DomainsSelect.propTypes = {
  domains: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
    }),
  ).isRequired,
  selectedDomain: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DomainsSelect;
