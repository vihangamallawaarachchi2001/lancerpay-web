export const RELEASE = {
  appName: "LancerPay",
  version: "1.2.1",
  versionLabel: "v1.2.1",
  channel: "stable",
  apkFileName: "lancerpay-v-1.2.1.apk",
  apkPath: "/lancerpay-v-1.2.1.apk",
  platform: "Android",
};

export function getVersionText() {
  return `${RELEASE.versionLabel} (${RELEASE.channel})`;
}
