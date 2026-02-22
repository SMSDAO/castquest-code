/**
 * Component Builder - Component Generation System
 * 
 * Builds reusable components for various frameworks and platforms.
 */

export interface ComponentSpec {
  name: string;
  type: 'ui' | 'service' | 'util' | 'model';
  framework?: 'react' | 'vue' | 'angular' | 'none';
  props?: ComponentProp[];
  methods?: ComponentMethod[];
  state?: ComponentState[];
}

export interface ComponentProp {
  name: string;
  type: string;
  required: boolean;
  default?: any;
  description?: string;
}

export interface ComponentMethod {
  name: string;
  parameters: Array<{ name: string; type: string }>;
  returnType: string;
  description?: string;
}

export interface ComponentState {
  name: string;
  type: string;
  initial: any;
}

/**
 * ComponentBuilder class for building components
 */
export class ComponentBuilder {
  /**
   * Build component from specification
   */
  async build(spec: ComponentSpec): Promise<string> {
    switch (spec.framework) {
      case 'react':
        return this.buildReactComponent(spec);
      case 'vue':
        return this.buildVueComponent(spec);
      case 'angular':
        return this.buildAngularComponent(spec);
      default:
        return this.buildGenericComponent(spec);
    }
  }

  /**
   * Build React component
   */
  private buildReactComponent(spec: ComponentSpec): string {
    const propTypes = this.generatePropTypes(spec.props || []);
    const stateHooks = this.generateStateHooks(spec.state || []);
    const methods = this.generateMethods(spec.methods || []);

    return `
import React, { useState } from 'react';

interface ${spec.name}Props {
${propTypes}
}

/**
 * ${spec.name} Component
 */
export const ${spec.name}: React.FC<${spec.name}Props> = (props) => {
${stateHooks}

${methods}

  return (
    <div className="${this.toKebabCase(spec.name)}">
      <h2>${spec.name}</h2>
      {/* Add component content */}
    </div>
  );
};

export default ${spec.name};
`;
  }

  /**
   * Build Vue component
   */
  private buildVueComponent(spec: ComponentSpec): string {
    return `
<template>
  <div class="${this.toKebabCase(spec.name)}">
    <h2>${spec.name}</h2>
    <!-- Add component content -->
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: '${spec.name}',
  props: {
${this.generateVueProps(spec.props || [])}
  },
  setup(props) {
${this.generateVueState(spec.state || [])}

    return {
      // Expose to template
    };
  }
});
</script>

<style scoped>
.${this.toKebabCase(spec.name)} {
  /* Add styles */
}
</style>
`;
  }

  /**
   * Build Angular component
   */
  private buildAngularComponent(spec: ComponentSpec): string {
    return `
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-${this.toKebabCase(spec.name)}',
  template: \`
    <div class="${this.toKebabCase(spec.name)}">
      <h2>${spec.name}</h2>
      <!-- Add component content -->
    </div>
  \`,
  styles: []
})
export class ${spec.name}Component {
${this.generateAngularInputs(spec.props || [])}

  constructor() {}

${this.generateAngularMethods(spec.methods || [])}
}
`;
  }

  /**
   * Build generic component
   */
  private buildGenericComponent(spec: ComponentSpec): string {
    return `
/**
 * ${spec.name} Component
 */
export class ${spec.name} {
${this.generateClassProperties(spec.state || [])}

  constructor() {
    // Initialize
  }

${this.generateClassMethods(spec.methods || [])}
}
`;
  }

  /**
   * Generate TypeScript prop types
   */
  private generatePropTypes(props: ComponentProp[]): string {
    return props.map(prop => {
      const optional = prop.required ? '' : '?';
      const comment = prop.description ? `  /** ${prop.description} */\n` : '';
      return `${comment}  ${prop.name}${optional}: ${prop.type};`;
    }).join('\n');
  }

  /**
   * Generate React state hooks
   */
  private generateStateHooks(state: ComponentState[]): string {
    return state.map(s => {
      return `  const [${s.name}, set${this.capitalize(s.name)}] = useState<${s.type}>(${JSON.stringify(s.initial)});`;
    }).join('\n');
  }

  /**
   * Generate methods
   */
  private generateMethods(methods: ComponentMethod[]): string {
    return methods.map(method => {
      const params = method.parameters.map(p => `${p.name}: ${p.type}`).join(', ');
      const comment = method.description ? `  /** ${method.description} */\n` : '';
      return `${comment}  const ${method.name} = (${params}): ${method.returnType} => {
    // Implementation
  };`;
    }).join('\n\n');
  }

  /**
   * Generate Vue props
   */
  private generateVueProps(props: ComponentProp[]): string {
    return props.map(prop => {
      return `    ${prop.name}: {
      type: ${this.getVueType(prop.type)},
      required: ${prop.required},
      default: ${JSON.stringify(prop.default)}
    }`;
    }).join(',\n');
  }

  /**
   * Generate Vue state
   */
  private generateVueState(state: ComponentState[]): string {
    return state.map(s => {
      return `    const ${s.name} = ref<${s.type}>(${JSON.stringify(s.initial)});`;
    }).join('\n');
  }

  /**
   * Generate Angular inputs
   */
  private generateAngularInputs(props: ComponentProp[]): string {
    return props.map(prop => {
      const comment = prop.description ? `  /** ${prop.description} */\n` : '';
      return `${comment}  @Input() ${prop.name}${prop.required ? '' : '?'}: ${prop.type};`;
    }).join('\n');
  }

  /**
   * Generate Angular methods
   */
  private generateAngularMethods(methods: ComponentMethod[]): string {
    return methods.map(method => {
      const params = method.parameters.map(p => `${p.name}: ${p.type}`).join(', ');
      const comment = method.description ? `  /** ${method.description} */\n` : '';
      return `${comment}  ${method.name}(${params}): ${method.returnType} {
    // Implementation
  }`;
    }).join('\n\n');
  }

  /**
   * Generate class properties
   */
  private generateClassProperties(state: ComponentState[]): string {
    return state.map(s => {
      return `  private ${s.name}: ${s.type} = ${JSON.stringify(s.initial)};`;
    }).join('\n');
  }

  /**
   * Generate class methods
   */
  private generateClassMethods(methods: ComponentMethod[]): string {
    return methods.map(method => {
      const params = method.parameters.map(p => `${p.name}: ${p.type}`).join(', ');
      const comment = method.description ? `  /** ${method.description} */\n` : '';
      return `${comment}  ${method.name}(${params}): ${method.returnType} {
    // Implementation
  }`;
    }).join('\n\n');
  }

  /**
   * Get Vue type
   */
  private getVueType(type: string): string {
    const typeMap: Record<string, string> = {
      'string': 'String',
      'number': 'Number',
      'boolean': 'Boolean',
      'array': 'Array',
      'object': 'Object'
    };
    return typeMap[type.toLowerCase()] || 'Object';
  }

  /**
   * Convert to kebab-case
   */
  private toKebabCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase();
  }

  /**
   * Capitalize first letter
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
