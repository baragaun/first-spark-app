module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.dependencies && pkg.dependencies.dexie) {
        pkg.dependencies.dexie = "4.0.11";
      }
      if (pkg.devDependencies && pkg.devDependencies.dexie) {
        pkg.devDependencies.dexie = "4.0.11";
      }
      return pkg;
    }
  }
};
