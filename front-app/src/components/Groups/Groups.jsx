import React, { useContext, useState } from "react";
import DomainContext from "Contexts/DomainContext";
import ERROR_MESSAGES from "Constants/errorMessages";
import TextField from "Components/controls/TextField/TextField";
import ColorAddon from "Components/controls/ColorAddon/ColorAddon";
import PropTypes from "prop-types";

import style from "./Groups.scss";

const Groups = props => {
  const { selectedDomain } = props;
  const { selectDomainGroup, selectedDomainGroup } = useContext(DomainContext);
  const initialNewGroupState = {
    name: "",
    color: "#f6b73c",
  };
  const [newGroupState, changeNewGroupState] = useState(initialNewGroupState);

  function addGroup(event) {
    event.preventDefault();
    if (newGroupState.name) {
      changeNewGroupState(initialNewGroupState);
    }
  }

  function onChangeGroupName(value) {
    changeNewGroupState(prevState => {
      return {
        ...prevState,
        name: value,
      };
    });
  }

  function onChangeGroupColor(value) {
    changeNewGroupState(prevState => {
      return {
        ...prevState,
        color: value,
      };
    });
  }

  return (
    <div style={{ width: "100%" }}>
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
      <form onSubmit={addGroup} className={style.add_group_form}>
        <TextField
          value={newGroupState.name}
          name="new-group-name"
          addonAfter={
            <ColorAddon
              onChange={onChangeGroupColor}
              name="new-group-color"
              value={newGroupState.color}
            />
          }
          maxLength="20"
          placeholder="Type for a new group..."
          onChange={onChangeGroupName}
        />
      </form>
    </div>
  );
};

Groups.propTypes = {
  selectedDomain: PropTypes.shape({
    groups: PropTypes.arrayOf(PropTypes.any),
  }).isRequired,
};

export default Groups;
