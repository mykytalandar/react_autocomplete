import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [selectPerson, setSelectPerson] = useState<Person>();
  const [appliedQuery, setApplieduery] = useState('');

  const applyQuery = useCallback(debounce(setApplieduery, 300), []);

  const handleQuaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsActive(true);

    if (selectPerson && event.target.value !== selectPerson.name) {
      setSelectPerson(undefined);
    }
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery),
    );
  }, [appliedQuery, query]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectPerson
            ? `${selectPerson.name} (${selectPerson.born} - ${selectPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQuaryChange}
              onFocus={() => setIsActive(true)}
              onBlur={() => setIsActive(false)}
            />
          </div>
          {isActive && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => {
                  return (
                    <div
                      className="dropdown-item"
                      style={{ cursor: 'pointer' }}
                      data-cy="suggestion-item"
                      key={person.slug}
                      onMouseDown={() => {
                        setSelectPerson(person);
                        setQuery(person.name);
                        setIsActive(false);
                      }}
                    >
                      <p className="has-text-link">{person.name}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {filteredPeople.length === 0 && (
            <div
              className="
                notification
                is-danger
                is-light
                mt-3
                is-align-self-flex-start
              "
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
