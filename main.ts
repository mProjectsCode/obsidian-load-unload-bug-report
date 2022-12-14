import {MarkdownRenderChild, Plugin} from 'obsidian';

export default class BugReportPlugin extends Plugin {
	codeblocks: Emoji[];


	async onload() {

		this.codeblocks = [];

		this.addCommand({
			id: 'debug-log-active-code-blocks',
			name: 'Debug log active code blocks',
			callback: () => {
				console.log(this.codeblocks);
			},
		});

		this.registerMarkdownPostProcessor((element, context) => {
			const codeblocks = element.querySelectorAll("code");

			for (let index = 0; index < codeblocks.length; index++) {
				const codeblock = codeblocks.item(index);
				const text = codeblock.innerText.trim();
				const isEmoji = text[0] === ":" && text[text.length - 1] === ":";

				if (isEmoji) {
					context.addChild(new Emoji(this, codeblock, text, context.sourcePath));
				}
			}
		});

		this.registerMarkdownCodeBlockProcessor('bug-report', (source, el, context) => {
			const codeblock = el;
			const text = source.trim();

			context.addChild(new Emoji(this, codeblock, text, context.sourcePath));
		});
	}

	loadCodeblock(emoji: Emoji) {
		this.codeblocks.push(emoji);
	}

	unloadCodeblock(emoji: Emoji) {
		this.codeblocks = this.codeblocks.filter(x => x.id !== emoji.id);
	}

	onunload() {

	}
}

class Emoji extends MarkdownRenderChild {
	static ALL_EMOJIS: Record<string, string> = {
		":+1:": "👍",
		":sunglasses:": "😎",
		":smile:": "😄",
	};

	text: string;
	fileName: string;
	id: string;
	plugin: BugReportPlugin;

	constructor(plugin: BugReportPlugin, containerEl: HTMLElement, text: string, fileName: string) {
		super(containerEl);

		this.id = crypto.randomUUID();

		this.plugin = plugin;
		this.text = text;
		this.fileName = fileName;
	}

	onload() {
		console.log(`loaded markdown render child in file "${this.fileName}" with content "${this.text}" with id "${this.id}"`);
		this.plugin.loadCodeblock(this);

		const emojiEl = this.containerEl.createSpan({
			text: Emoji.ALL_EMOJIS[this.text] ?? this.text,
		});
		// this.containerEl.replaceWith(emojiEl);
	}

	onunload(): void {
		console.log(`unloaded markdown render child in file "${this.fileName}" with content "${this.text}" with id "${this.id}"`);
		this.plugin.unloadCodeblock(this);
	}
}
