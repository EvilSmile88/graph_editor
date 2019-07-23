import React, { useContext } from "react";
import DomainContext from "Contexts/DomainContext";
import ERROR_MESSAGES from "Constants/errorMessages";
import PropTypes from "prop-types";

import style from "./Groups.scss";

const Groups = props => {
  const { selectedDomain } = props;
  const { selectDomainGroup, selectedDomainGroup } = useContext(DomainContext);

  return (
    <React.Fragment>
      {selectedDomain.groups && selectedDomain.groups.length ? (
        <ul className={style.group_list}>
          {selectedDomain.groups.map(group => (
            <li key={group.id}>
              <button
                className={
                  selectedDomainGroup && selectedDomainGroup.name === group.name
                    ? style.active_group
                    : ""
                }
                style={{ borderColor: group.color }}
                type="button"
                onClick={() => selectDomainGroup(group)}
              >
                {group.name}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={style.error_message}>
          <i>{ERROR_MESSAGES.noGroups}</i>
        </p>
      )}
    </React.Fragment>
  );
};

Groups.propTypes = {
  selectedDomain: PropTypes.shape({
    groups: PropTypes.arrayOf(PropTypes.any),
  }).isRequired,
};

export default Groups;
