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

console.log('Applied ITJK header and About dialog customizations.')
