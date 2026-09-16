import { readFileSync, writeFileSync } from 'node:fs'

function replaceRequired(source, search, replacement, label) {
  if (!source.includes(search)) {
    throw new Error(`Unable to apply ITJK customization: ${label}`)
  }
  return source.replace(search, replacement)
}

function updateFile(path, transform) {
  const original = readFileSync(path, 'utf8')
  const updated = transform(original)
  writeFileSync(path, updated)
}

updateFile('apps/web/src/components/editor/editor-header/HelpDropdown.vue', (source) => {
  source = replaceRequired(
    source,
    'const emit = defineEmits([`openAbout`, `openFund`])',
    'const emit = defineEmits([`openAbout`])',
    'help emits',
  )
  source = replaceRequired(
    source,
    `
function openFundDialog() {
  emit(\`openFund\`)
}
`,
    '',
    'fund handler',
  )
  source = replaceRequired(
    source,
    `      <MenubarCheckboxItem @click="openFundDialog()">
        赞赏
      </MenubarCheckboxItem>
`,
    '',
    'submenu fund item',
  )
  source = replaceRequired(
    source,
    `      <MenubarCheckboxItem @click="openFundDialog()">
        <span>赞赏</span>
      </MenubarCheckboxItem>
`,
    '',
    'desktop fund item',
  )
  return source
})

updateFile('apps/web/src/components/editor/editor-header/AboutDialog.vue', () => `<script setup lang="ts">
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([\`close\`])

function onUpdate(val: boolean) {
  if (!val) {
    emit(\`close\`)
  }
}
<\/script>

<template>
  <Dialog :open="props.visible" @update:open="onUpdate">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>关于</DialogTitle>
      </DialogHeader>
      <div class="space-y-4 text-left leading-7">
        <p>
          一款高度简洁的IT极客 Markdown 编辑器，可以编辑公众号文章、简历、等内容。
        </p>
        <p>
          如需帮助联系IT极客
          <a
            href="mailto:mail@itjk.com"
            class="font-medium text-primary underline underline-offset-4"
          >
            mail@itjk.com
          </a>
        </p>
      </div>
      <DialogFooter>
        <Button @click="emit('close')">
          关闭
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
`)

updateFile('apps/web/src/components/editor/editor-header/index.vue', (source) => {
  source = replaceRequired(
    source,
    'const fundDialogVisible = ref(false)\n',
    '',
    'fund state',
  )
  source = replaceRequired(
    source,
    `
function handleOpenFund() {
  fundDialogVisible.value = true
}
`,
    '',
    'fund dialog handler',
  )
  source = source.replaceAll(' @open-fund="handleOpenFund"', '')
  source = replaceRequired(
    source,
    '  <FundDialog :visible="fundDialogVisible" @close="fundDialogVisible = false" />\n',
    '',
    'fund dialog component',
  )
  source = replaceRequired(
    source,
    '    <div class="space-x-2 hidden md:flex">\n      <Menubar class="menubar border-0">',
    `    <div class="hidden md:flex items-center gap-3">
      <a
        href="https://itjk.com"
        class="group flex shrink-0 items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-accent"
        aria-label="ITJK.com IT极客文档编辑器"
      >
        <span class="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold tracking-tight text-primary-foreground shadow-sm">
          IT
        </span>
        <span class="flex flex-col leading-none">
          <span class="text-sm font-bold tracking-tight">ITJK.com</span>
          <span class="mt-1 text-[10px] text-muted-foreground">IT极客文档编辑器</span>
        </span>
      </a>
      <Menubar class="menubar border-0">`,
    'desktop logo',
  )
  source = replaceRequired(
    source,
    `        <HelpDropdown @open-about="handleOpenAbout" />
      </Menubar>
    </div>`,
    `        <HelpDropdown @open-about="handleOpenAbout" />
      </Menubar>
      <a
        href="https://itjk.com"
        class="inline-flex h-9 items-center justify-center rounded-md border bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        回到主站
      </a>
    </div>`,
    'desktop home link',
  )
  source = replaceRequired(
    source,
    '    <div class="md:hidden">\n      <Menubar class="menubar border-0 p-0">',
    `    <div class="md:hidden flex items-center gap-2">
      <a
        href="https://itjk.com"
        class="flex shrink-0 items-center gap-1.5 rounded-md"
        aria-label="ITJK.com IT极客文档编辑器"
      >
        <span class="flex size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">IT</span>
        <span class="hidden text-xs font-bold sm:inline">ITJK.com</span>
      </a>
      <Menubar class="menubar border-0 p-0">`,
    'mobile logo',
  )
  source = replaceRequired(
    source,
    `        </MenubarMenu>
      </Menubar>
    </div>

    <!-- 右侧操作区 -->`,
    `        </MenubarMenu>
      </Menubar>
      <a
        href="https://itjk.com"
        class="hidden h-9 items-center rounded-md border px-2 text-xs font-medium sm:inline-flex"
      >
        回到主站
      </a>
    </div>

    <!-- 右侧操作区 -->`,
    'mobile home link',
  )
  return source
})

updateFile('apps/web/index.html', (source) => {
  source = replaceRequired(
    source,
    '<meta name="keywords" content="md,markdown,markdown-editor,wechat,official-account,yanglbme,doocs" />',
    '<meta name="keywords" content="IT极客,itjk,markdown,markdown-editor,公众号编辑器,文档编辑器" />',
    'page keywords',
  )
  source = replaceRequired(
    source,
    '<meta name="description" content="Wechat Markdown Editor | 一款高度简洁的微信 Markdown 编辑器" />',
    '<meta name="description" content="IT极客 Markdown 编辑器 | 一款高度简洁的 Markdown 文档编辑器" />',
    'page description',
  )
  source = replaceRequired(
    source,
    '<title>微信 Markdown 编辑器 | Doocs 开源社区</title>',
    '<title>IT极客 Markdown 编辑器 | IT极客</title>',
    'page title',
  )
  return source
})

updateFile('apps/web/src/assets/example/markdown.md', (source) => {
  source = replaceRequired(
    source,
    '[访问 Doocs](https://github.com/doocs)',
    '[访问 IT极客](https://itjk.com)',
    'example site link',
  )
  source = replaceRequired(
    source,
    '![doocs](https://cdn-doocs.oss-cn-shenzhen.aliyuncs.com/gh/doocs/md/images/logo-2.png)',
    '**IT极客文档编辑器**：专注于公众号文章、简历和技术文档的高效编辑。',
    'example logo',
  )
  source = replaceRequired(
    source,
    'console.log(`Hello, Doocs!`)',
    'console.log(`Hello, ITJK!`)',
    'example code',
  )
  source = replaceRequired(
    source,
    [
      '| 项目人员                                    | 邮箱                   | 微信号       |',
      '| ------------------------------------------- | ---------------------- | ------------ |',
      '| [yanglbme](https://github.com/yanglbme)     | contact@yanglibin.info | YLB0109      |',
      '| [YangFong](https://github.com/YangFong)     | yangfong2022@gmail.com | yq2419731931 |',
      '| [thinkasany](https://github.com/thinkasany) | thinkasany@gmail.com   | thinkasany   |',
    ].join('\n'),
    [
      '| 使用场景 | 推荐内容 |',
      '| -------- | -------- |',
      '| 公众号文章 | 技术分享、产品介绍、行业资讯 |',
      '| 简历 | 个人经历、项目经验、技能清单 |',
      '| 技术文档 | 使用说明、知识笔记、项目文档 |',
    ].join('\n'),
    'example author table',
  )
  source = replaceRequired(
    source,
    [
      '- [阿里又一个 20k+ stars 开源项目诞生，恭喜 fastjson！](https://mp.weixin.qq.com/s/RNKDCK2KoyeuMeEs6GUrow)',
      '- [刷掉 90% 候选人的互联网大厂海量数据面试题（附题解 + 方法总结）](https://mp.weixin.qq.com/s/rjGqxUvrEqJNlo09GrT1Dw)',
      '- [好用！期待已久的文本块功能究竟如何在 Java 13 中发挥作用？](https://mp.weixin.qq.com/s/kalGv5T8AZGxTnLHr2wDsA)',
      '- [2019 GitHub 开源贡献排行榜新鲜出炉！微软谷歌领头，阿里跻身前 12！](https://mp.weixin.qq.com/s/_q812aGD1b9QvZ2WFI0Qgw)',
    ].join('\n'),
    [
      '- [访问 IT极客主站](https://itjk.com)',
      '- [使用 IT极客文档编辑器](https://md.itjk.com)',
      '- 如需帮助，请联系 [mail@itjk.com](mailto:mail@itjk.com)',
    ].join('\n'),
    'example recommended reading',
  )
  source = replaceRequired(
    source,
    [
      '---',
      '',
      '<center>',
      '    <img src="https://cdn-doocs.oss-cn-shenzhen.aliyuncs.com/gh/doocs/md/images/1648303220922-7e14aefa-816e-44c1-8604-ade709ca1c69.png" style="width: 100px;">',
      '</center>',
    ].join('\n'),
    [
      '---',
      '',
      '由 IT极客文档编辑器提供。',
    ].join('\n'),
    'example footer',
  )
  return source
})

updateFile('apps/web/src/assets/example/theme-css.txt', (source) =>
  replaceRequired(
    source,
    ' * 提交区：https://github.com/doocs/md/discussions/426',
    ' * IT极客：https://itjk.com',
    'theme attribution',
  ),
)

updateFile('apps/web/src/components/editor/CustomUploadForm.vue', (source) =>
  source.replaceAll('https://github.com/doocs/md/blob/main/docs/custom-upload.md', 'https://itjk.com'),
)

updateFile('apps/web/src/components/editor/InsertMpCardDialog.vue', (source) => {
  source = source.replaceAll(
    'https://cdn-doocs.oss-cn-shenzhen.aliyuncs.com/gh/doocs/md/images/mp-logo.png',
    'https://md.itjk.com/favicon.ico',
  )
  source = source.replaceAll('例：Doocs', '例：IT极客')
  source = source.replaceAll('例：https://doocs.com/mp-logo.png', '例：https://itjk.com/favicon.ico')
  source = source.replaceAll(
    '例：GitHub 开源组织 @Doocs 旗下唯一公众号，专注分享技术领域相关知识及行业最新资讯。',
    '例：IT极客，专注分享技术知识、实用工具和行业资讯。',
  )
  source = source.replaceAll('https://github.com/doocs/md/blob/main/docs/mp-card.md', 'https://itjk.com')
  return source
})

updateFile('apps/web/src/components/editor/UploadImgDialog.vue', (source) => {
  source = source.replaceAll('yanglbme', 'itjk')
  source = source.replaceAll('doocs', 'itjk')
  source = source.replaceAll('DOOCS', 'ITJK')
  source = source.replaceAll('https://md-pages.itjk.org/tutorial/', 'https://itjk.com')
  source = source.replaceAll('https://github.com/itjk/md/blob/main/docs/telegram-usage.md', 'https://itjk.com')
  return source
})

updateFile('apps/web/src/entrypoints/background.ts', (source) =>
  source.replaceAll('https://md-pages.doocs.org/welcome', 'https://itjk.com'),
)

updateFile('apps/web/src/entrypoints/popup/App.vue', (source) =>
  source.replaceAll('https://md-pages.doocs.org/tutorial', 'https://itjk.com'),
)

updateFile('apps/web/vite.config.ts', (source) => {
  source = source.replaceAll('name: `@doocs-md`', 'name: `IT极客 Markdown 编辑器`')
  source = source.replaceAll('short_name: `@doocs-md`', 'short_name: `ITJK MD`')
  return source
})

updateFile('apps/web/src/components/editor/editor-header/FundDialog.vue', () => `<template>
  <div />
</template>
`)


console.log('Applied ITJK branding, content, header, and About dialog customizations.')
