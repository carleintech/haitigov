export function isVersionAtLeast(currentVersion, minimumVersion) {
  const [currentMajor = "0", currentMinor = "0", currentPatch = "0"] = currentVersion.split(".");
  const [minimumMajor = "0", minimumMinor = "0", minimumPatch = "0"] = minimumVersion.split(".");
  const current = [currentMajor, currentMinor, currentPatch].map((part) =>
    Number.parseInt(part, 10),
  );
  const minimum = [minimumMajor, minimumMinor, minimumPatch].map((part) =>
    Number.parseInt(part, 10),
  );
  const [currentMajorNumber = 0, currentMinorNumber = 0, currentPatchNumber = 0] = current;
  const [minimumMajorNumber = 0, minimumMinorNumber = 0, minimumPatchNumber = 0] = minimum;

  if (currentMajorNumber !== minimumMajorNumber) {
    return currentMajorNumber > minimumMajorNumber;
  }

  if (currentMinorNumber !== minimumMinorNumber) {
    return currentMinorNumber > minimumMinorNumber;
  }

  return currentPatchNumber >= minimumPatchNumber;
}
