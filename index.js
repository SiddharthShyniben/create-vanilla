import prompt from 'prompts';
import { existsSync, lstatSync, mkdirSync, readdirSync, writeFileSync } from 'fs';
import nanoparse from 'nanoparse';
import color from 'planckcolors';
import { join } from 'path';

const argv = nanoparse(process.argv.slice(2));

if (!argv._[0]) {
	console.log(color.cyan('>'), 'No directory provided. Using current directory.');
}

const folder = argv._[0] || '.';

try {
	if (lstatSync(folder).isFile()) {
		console.error(color.red('>'), 'Path is file. Cannot continue');
		process.exit(65);
	}

	if (readdirSync(folder).length !== 0) {
		const {value} = await prompt({type: 'confirm', name: 'value', message: 'Directory not empty. Continue?'});
		if (!value) process.exit(65)
	}
} catch (e) {
	// console.error(color.red('>'), e.message);
	// process.exit(69);
}

if (!existsSync(folder)) mkdirSync(folder);

try {
mkdirSync(join(folder, 'style'));
mkdirSync(join(folder, 'script'));
writeFileSync(join(folder, 'index.html'), `
<!DOCTYPE html>
<html lang='en'>
	<head>
		<meta charset='UTF-8'>
		<meta name='viewport' content='width=device-width, initial-scale=1.0'>
		<meta name='description' content='Insert your website description here'>
		<meta name='keywords' content='Insert your website keywords here'>
		<meta name='author' content='Insert your name here'>
		<title>Insert your page title here</title>

		<link rel='stylesheet' type='text/css' href='style/main.css'>
	</head>
	<body>

		<script src='script/main.js'></script>
	</body>
</html>
`.trim())

writeFileSync(join(folder, 'style/main.css'), `
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

body {
	font-family: sans-serif;
	font-size: 16px;
	line-height: 1.5;
}
`.trim())

writeFileSync(join(folder, 'script/main.js'), `
'use strict';

console.log('Hello, World!');
`.trim())
} catch (e) {
	console.error(color.red('>'), e.message);
	process.exit(73);
}

if (folder !== '.') console.log(color.green('>'), 'Generated template! Run', color.blackBg(color.red(` cd ${folder} `)), 'to get started!');
