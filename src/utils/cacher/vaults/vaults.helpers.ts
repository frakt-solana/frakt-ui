const VERIFIED_VAULTS_BY_FRAKT_TEAM_URL =
  process.env.VERIFIED_VAULTS_BY_FRAKT_TEAM_URL;

export const getVerifiedVaultsByFraktTeam = async (): Promise<string[]> => {
  try {
    return await (await fetch(VERIFIED_VAULTS_BY_FRAKT_TEAM_URL)).json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return [];
  }
};
