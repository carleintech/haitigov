"use client";

import { useState } from "react";
import { departments, type HomeLocale, homeCopy } from "../_data/homepage.js";

export function DepartmentExplorer({ locale }: Readonly<{ locale: HomeLocale }>) {
  const labels = locale === "ht" ? homeCopy.ht : homeCopy.fr;
  const [departmentId, setDepartmentId] = useState("HT-DEP-03");
  const department = departments.find((item) => item.id === departmentId);
  if (!department) throw new Error("Selected department is missing from the territorial registry.");

  return (
    <div className="hg-portal-department">
      <label htmlFor="home-department">{labels.select}</label>
      <select
        id="home-department"
        value={departmentId}
        onChange={(event) => {
          setDepartmentId(event.target.value);
        }}
      >
        {departments.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      <div aria-live="polite" aria-atomic="true">
        <div className="hg-portal-department__content" key={department.id}>
          <h3>{department.name}</h3>
          <p>
            {labels.capital} : <strong>{department.capital}</strong>
          </p>
          <dl>
            <div>
              <dt>{labels.communes}</dt>
              <dd>{department.communes}</dd>
            </div>
            <div>
              <dt>{labels.arrondissements}</dt>
              <dd>{department.arrondissements}</dd>
            </div>
            <div>
              <dt>{labels.sections}</dt>
              <dd>{department.sections}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
