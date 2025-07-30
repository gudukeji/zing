// +----------------------------------------------------------------------
// | 项目验证脚本 - 检查代码规范和功能完整性
// +----------------------------------------------------------------------

const fs = require('fs');
const path = require('path');

class ProjectValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.stats = {
      totalFiles: 0,
      vueFiles: 0,
      jsFiles: 0,
      processedFiles: 0
    };
  }

  // 验证文件命名规范
  validateFileNaming(filePath) {
    const fileName = path.basename(filePath);
    const ext = path.extname(fileName);
    const baseName = fileName.replace(ext, '');

    // Vue文件应使用短横线命名法
    if (ext === '.vue' && !baseName.match(/^[a-z0-9]+(-[a-z0-9]+)*$/)) {
      this.warnings.push(`文件命名不规范: ${filePath} (建议使用短横线命名法)`);
    }

    // JavaScript文件命名检查
    if (ext === '.js' && !baseName.match(/^[a-zA-Z0-9]+([A-Z][a-z0-9]*)*$|^[a-z0-9]+(-[a-z0-9]+)*$/)) {
      this.warnings.push(`JS文件命名不规范: ${filePath}`);
    }
  }

  // 验证变量命名规范
  validateVariableNaming(content, filePath) {
    // 检查是否使用了禁用的变量名
    const forbiddenNames = ['temp', 'tmp', 'test', 'demo', 'data', 'item'];
    const dataMatch = content.match(/data\(\)\s*\{[\s\S]*?return\s*\{([\s\S]*?)\}/);
    
    if (dataMatch) {
      const dataContent = dataMatch[1];
      forbiddenNames.forEach(name => {
        const regex = new RegExp(`\\b${name}\\s*:`, 'g');
        if (regex.test(dataContent)) {
          this.warnings.push(`${filePath}: 使用了不推荐的变量名 "${name}"`);
        }
      });
    }
  }

  // 验证console语句是否已清理
  validateConsoleStatements(content, filePath) {
    const consoleMatches = content.match(/console\.(log|warn|error|info|debug)/g);
    if (consoleMatches && !filePath.includes('node_modules')) {
      this.warnings.push(`${filePath}: 发现 ${consoleMatches.length} 个console语句需要清理`);
    }
  }

  // 验证定时器使用
  validateTimerUsage(content, filePath) {
    const timerMatches = content.match(/(setTimeout|setInterval)\s*\(/g);
    const clearMatches = content.match(/(clearTimeout|clearInterval)\s*\(/g);
    
    if (timerMatches && timerMatches.length > 0) {
      if (!clearMatches || clearMatches.length < timerMatches.length) {
        this.warnings.push(`${filePath}: 定时器使用可能存在内存泄漏风险`);
      }
    }
  }

  // 验证Vue组件结构
  validateVueComponent(content, filePath) {
    // 检查是否混用Vue 2和Vue 3语法
    const hasOptionsAPI = /export\s+default\s*\{/.test(content);
    const hasCompositionAPI = /<script\s+setup>/.test(content);
    
    if (hasOptionsAPI && hasCompositionAPI) {
      this.warnings.push(`${filePath}: 混用了Options API和Composition API`);
    }

    // 检查组件是否有name属性
    if (hasOptionsAPI && !/name\s*:\s*['"`]/.test(content)) {
      this.warnings.push(`${filePath}: 组件缺少name属性`);
    }
  }

  // 验证API调用规范
  validateAPIUsage(content, filePath) {
    // 检查是否使用了标准化的数据转换
    const hasAPICall = /request\.(get|post|put|delete)/.test(content);
    const hasDataTransformer = /DataTransformer/.test(content);
    
    if (hasAPICall && !hasDataTransformer && !filePath.includes('api/')) {
      this.warnings.push(`${filePath}: API调用未使用DataTransformer进行数据标准化`);
    }
  }

  // 处理单个文件
  processFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      this.stats.processedFiles++;

      // 更新文件统计
      if (filePath.endsWith('.vue')) {
        this.stats.vueFiles++;
        this.validateVueComponent(content, filePath);
      } else if (filePath.endsWith('.js')) {
        this.stats.jsFiles++;
      }

      // 通用验证
      this.validateFileNaming(filePath);
      this.validateVariableNaming(content, filePath);
      this.validateConsoleStatements(content, filePath);
      this.validateTimerUsage(content, filePath);
      this.validateAPIUsage(content, filePath);

    } catch (error) {
      this.errors.push(`读取文件失败: ${filePath} - ${error.message}`);
    }
  }

  // 递归处理目录
  processDirectory(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // 跳过某些目录
          if (!['node_modules', '.git', 'unpackage', '.hbuilderx'].includes(item)) {
            this.processDirectory(fullPath);
          }
        } else if (stat.isFile()) {
          this.stats.totalFiles++;
          
          // 只处理相关文件类型
          if (item.endsWith('.vue') || item.endsWith('.js')) {
            this.processFile(fullPath);
          }
        }
      });
    } catch (error) {
      this.errors.push(`处理目录失败: ${dirPath} - ${error.message}`);
    }
  }

  // 验证配置文件
  validateConfigs() {
    const configFiles = [
      'package.json',
      'manifest.json', 
      'pages.json',
      'vite.config.js'
    ];

    configFiles.forEach(file => {
      if (fs.existsSync(file)) {
        try {
          const content = fs.readFileSync(file, 'utf8');
          
          if (file === 'package.json') {
            const pkg = JSON.parse(content);
            if (!pkg.scripts || !pkg.scripts.dev) {
              this.warnings.push('package.json缺少dev脚本');
            }
          }
          
          if (file === 'vite.config.js') {
            if (!content.includes('drop_console')) {
              this.warnings.push('vite.config.js未配置console清理');
            }
          }
        } catch (error) {
          this.errors.push(`配置文件验证失败: ${file} - ${error.message}`);
        }
      } else {
        this.warnings.push(`配置文件不存在: ${file}`);
      }
    });
  }

  // 验证工具文件是否存在
  validateUtilityFiles() {
    const utilityFiles = [
      'utils/dataTransformer.js',
      'utils/dateFormatter.js',
      'utils/timerManager.js',
      'utils/logger.js',
      'config/standards.js'
    ];

    utilityFiles.forEach(file => {
      if (!fs.existsSync(file)) {
        this.errors.push(`工具文件缺失: ${file}`);
      }
    });
  }

  // 生成报告
  generateReport() {
    console.log('\n=== 项目验证报告 ===\n');
    
    // 统计信息
    console.log('📊 文件统计:');
    console.log(`  总文件数: ${this.stats.totalFiles}`);
    console.log(`  Vue文件: ${this.stats.vueFiles}`);
    console.log(`  JS文件: ${this.stats.jsFiles}`);
    console.log(`  已处理: ${this.stats.processedFiles}`);
    console.log('');

    // 错误信息
    if (this.errors.length > 0) {
      console.log('❌ 错误 (' + this.errors.length + ' 个):');
      this.errors.forEach(error => {
        console.log(`  - ${error}`);
      });
      console.log('');
    }

    // 警告信息
    if (this.warnings.length > 0) {
      console.log('⚠️ 警告 (' + this.warnings.length + ' 个):');
      this.warnings.slice(0, 20).forEach(warning => { // 只显示前20个警告
        console.log(`  - ${warning}`);
      });
      if (this.warnings.length > 20) {
        console.log(`  ... 还有 ${this.warnings.length - 20} 个警告`);
      }
      console.log('');
    }

    // 建议
    console.log('💡 建议:');
    if (this.warnings.length > 0) {
      console.log('  - 建议逐步修复警告中的问题');
    }
    if (this.errors.length === 0) {
      console.log('  - 项目结构完整，可以正常运行');
    }
    console.log('  - 建议运行 `npm run dev` 测试项目');
    console.log('  - 建议定期使用此脚本验证代码质量');
    
    // 总结
    const score = Math.max(0, 100 - this.errors.length * 10 - this.warnings.length * 2);
    console.log(`\n🎯 项目质量评分: ${score}/100`);
    
    if (score >= 90) {
      console.log('✅ 项目质量优秀！');
    } else if (score >= 75) {
      console.log('✅ 项目质量良好');
    } else if (score >= 60) {
      console.log('⚠️ 项目质量一般，建议优化');
    } else {
      console.log('❌ 项目质量较差，需要重点优化');
    }
  }

  // 运行验证
  run() {
    console.log('🔍 开始验证项目...\n');
    
    // 验证主要目录
    ['pages', 'components', 'api', 'utils', 'stores'].forEach(dir => {
      if (fs.existsSync(dir)) {
        this.processDirectory(dir);
      }
    });

    // 验证配置文件
    this.validateConfigs();
    
    // 验证工具文件
    this.validateUtilityFiles();
    
    // 生成报告
    this.generateReport();
    
    return {
      success: this.errors.length === 0,
      errors: this.errors.length,
      warnings: this.warnings.length,
      score: Math.max(0, 100 - this.errors.length * 10 - this.warnings.length * 2)
    };
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const validator = new ProjectValidator();
  const result = validator.run();
  
  // 根据结果设置退出码
  process.exit(result.success ? 0 : 1);
}

module.exports = ProjectValidator;