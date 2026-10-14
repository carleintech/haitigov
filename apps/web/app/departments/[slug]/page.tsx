import { notFound } from "next/navigation.js";
import { DepartmentPage } from "../../_components/department-page.js";
import { departmentPages, findDepartment } from "../../_data/departments.js";

export function generateStaticParams() {
  return departmentPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const department = findDepartment((await params).slug);
  return { title: department ? `${department.name} — Depatman — HaitiGov` : "Depatman — HaitiGov" };
}

export default async function DepartmentDetail({
  params,
}: Readonly<{ params: Promise<{ slug: string }> }>) {
  const department = findDepartment((await params).slug);
  if (!department) notFound();
  return <DepartmentPage locale="ht" department={department} />;
}
export const dynamicParams = false;
