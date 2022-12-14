import { Plugin } from 'obsidian';

export default class BugReportPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				console.log('test');
			},
		});
	}

	onunload() {

	}
}
