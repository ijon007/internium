/** A file the reader can open: a display name, a URL (public sample or blob:) and a meta line. */
export type ViewerFile = { name: string; url: string; meta?: string };

export const isWordFile = (name: string) => /\.docx?$/i.test(name);

/** Mock data: every document resolves to a sample under /public/samples by type and extension. */
export function sampleUrl(slug: string, name = ".pdf") {
  return `/samples/${slug}.${isWordFile(name) ? "docx" : "pdf"}`;
}

const COORDINATOR_SAMPLE: Record<string, string> = {
  agreement: "contract",
  plan: "yearly-program",
  diary: "monthly-notebook",
  evaluation: "weekly-report",
  certificate: "mou",
};

/** A student's submitted copy of a coordinator document type, backed by a sample file. */
export function studentDocFile(student: string, type: { id: string; label: string }, status: string): ViewerFile {
  return {
    name: `${student} – ${type.label}.pdf`,
    url: sampleUrl(COORDINATOR_SAMPLE[type.id] ?? "contract"),
    meta: status,
  };
}
