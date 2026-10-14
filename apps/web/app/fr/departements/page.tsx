import { DepartmentsDirectory } from "../../_components/departments-directory.js";

export const metadata = { title: "Les Départements d’Haïti — HaitiGov" };

export default function FrenchDepartmentsPage() {
  return <DepartmentsDirectory locale="fr" />;
}
