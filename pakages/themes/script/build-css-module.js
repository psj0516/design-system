import * as theme from '../dist/index.js';
import fs from 'fs'; // 파일을 읽고 쓰는 node.js 파일 시스템 모듈

// CamelCase 또는 PascalCase → kebab-case 변환용
const toCssCasting = (str) => {
  return str
    .replace(/([a-z])(\d)/, "$1-$2")
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase();
};

const generateThemeCssVariables = () => {
  const cssString = [];

  Object.entries(theme.vars).forEach(([key, value]) => {
    if (key === "colors") { // theme.vars의 colors만 처리
      Object.entries(value.$static).forEach(([colorKey, colorValue]) => {
        if (colorKey === 'light') {
          const selector = ':root';

          // css 변수 형태로 변환
          const cssVariables = Object.entries(colorValue).map(
            ([mainKey, mainValue]) =>
              Object.entries(mainValue)
                .map(([subKey, subValue]) =>
                  `--${toCssCasting(mainKey)}-${toCssCasting(subKey)}: ${subValue};`
              ).join('\n')
          ).join('\n');

          cssString.push(`${selector} {\n${cssVariables}\n}`);
        }
      });
    }
  });
  return cssString;
};

// 위에서 만든 cssString을 모아서 dist/themes.css 파일로 저장(덮어씀)
const generateThemeCss = () => {
  const variables = generateThemeCssVariables();

  fs.writeFileSync("dist/themes.css", [...variables].join("\n"));
}

generateThemeCss();