const { build } = require("esbuild");

const baseConfig = {
  bundle: true,
  minify: process.env.NODE_ENV === "production",
  sourcemap: process.env.NODE_ENV !== "production",
};

const extensionConfig = {
  ...baseConfig,
  platform: "node",
  mainFields: ["module", "main"],
  format: "cjs",
  entryPoints: ["./src/extension.ts"],
  outfile: "./out/extension.js",
  external: ["vscode"],
};

const copyConfig = {
	...baseConfig,
	entryPoints: ["./assets/configuration.html", "./assets/styles.css"],
	outdir: "./out/",
	loader: { ".html" : 'copy', ".css" : 'copy' }
  };

const watchConfig = {
	watch: {
	  onRebuild(error, result) {
		console.log("[watch] build started");
		if (error) {
		  error.errors.forEach(error =>
			console.error(`> ${error.location.file}:${error.location.line}:${error.location.column}: error: ${error.text}`)
		  );
		} else {
		  console.log("[watch] build finished");
		}
	  },
	},
  };

  const webviewConfig = {
	...baseConfig,
	target: "es2020",
	format: "esm",
	entryPoints: ["./src/webview/main.ts"],
	outfile: "./out/webview.js",
  };

  (async () => {
	const args = process.argv.slice(2);
	try {
	  if (args.includes("--watch")) {
		console.log("[watch] build started");
		await build({
		  ...extensionConfig,
		  ...watchConfig,
		});
		await build({
			...copyConfig,
			...watchConfig,
		  });
		  await build({
		  ...webviewConfig,
		  ...watchConfig,
		});
		console.log("[watch] build finished");
	  } else {
		// Build extension and webview code
		await build(extensionConfig);
		await build(copyConfig);
		await build(webviewConfig);
		console.log("build complete");
	  }
	} catch (err) {
	  process.stderr.write(err.stderr);
	  process.exit(1);
	}
  })();
