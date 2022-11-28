{ pkgs }: {
	deps = [
		pkgs.python39Packages.pip
    pkgs.nodejs-16_x
      pkgs.nodePackages.typescript-language-server
      pkgs.yarn
      pkgs.replitPackages.jest
      pkgs.python39Full
      pkgs.libuuid
	];
  env = {
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [pkgs.libuuid];
  };
}