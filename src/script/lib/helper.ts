/* istanbul ignore next */
export function dynamicList(list, selectEm, title?: string) {
  let options = '';
  if (title !== undefined) {
    options = '<option value="" disabled selected>' + title + '</option>';
  }

  for(let i = 0; i < list.length; i++) {
    options += '<option value="'+list[i]+'">'+list[i]+'</option>';
  }
  document.getElementById(selectEm).innerHTML = options;
}

export function escapeHTML(str: string): string {
  return str.replace(/([<>&"'])/g, (match, p1) => (
    {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&apos;'
    }[p1])
  );
}

export function exportToFile(dataStr, fileName = 'data.txt') {
  let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', fileName);
  linkElement.click();
  linkElement.remove();
}

// /^\d+\.\d+\.\d+$/
export function getVersion(version: string): Version {
  let versionValues = version.split('.');
  return {
    major: parseInt(versionValues[0]),
    minor: parseInt(versionValues[1]),
    patch: parseInt(versionValues[2])
  };
}

// Is the provided version lower than the minimum version?
export function isVersionOlder(version: Version, minimum: Version): boolean {
  if (version.major < minimum.major) {
    return true;
  } else if (version.major == minimum.major && version.minor < minimum.minor) {
    return true;
  } else if (version.major == minimum.major && version.minor == minimum.minor && version.patch < minimum.patch) {
    return true;
  }

  return false;
}

export function readFile(file) {
  return new Promise((resolve, reject) => {
    let fr = new FileReader();
    fr.onload = () => { resolve(fr.result); };
    fr.readAsText(file);
  });
}

export function removeFromArray(array: string[], element: string) {
  return array.filter(e => e !== element);
}