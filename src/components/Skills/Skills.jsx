import './Skills.css';

function Skills() {
  const skillCategories = [
    {
      title: '前端开发',
      icon: '◈',
      description: '精通现代前端技术栈，注重用户体验与代码质量',
      skills: [
        { name: 'React / Next.js', level: 90 },
        { name: 'TypeScript', level: 85 },
        { name: 'Vue 3', level: 80 },
        { name: 'CSS / Tailwind', level: 92 },
      ],
    },
    {
      title: '后端开发',
      icon: '◇',
      description: '具备全栈思维，能够独立完成后端服务开发',
      skills: [
        { name: 'Node.js / Express', level: 75 },
        { name: 'Python / Django', level: 70 },
        { name: 'MongoDB / MySQL', level: 72 },
        { name: 'RESTful / GraphQL', level: 78 },
      ],
    },
    {
      title: '设计能力',
      icon: '○',
      description: '具备产品思维，能够独立完成 UI/UX 设计',
      skills: [
        { name: 'Figma', level: 85 },
        { name: '交互设计', level: 78 },
        { name: '视觉设计', level: 75 },
        { name: '原型设计', level: 82 },
      ],
    },
    {
      title: '其他技能',
      icon: '△',
      description: '持续学习新技术，保持技术敏感度',
      skills: [
        { name: 'Git / GitHub', level: 88 },
        { name: 'Docker / CI/CD', level: 65 },
        { name: 'Linux 运维', level: 60 },
        { name: '算法与数据结构', level: 72 },
      ],
    },
  ];

  const softSkills = [
    '团队协作', '快速学习', '问题解决', '沟通表达',
    '项目管理', '创新思维', '时间管理', '责任心强',
  ];

  return (
    <section id="skills" className="skills">
      <div className="container">
        <div className="skills__header">
          <span className="section-label">03 / 个人优势</span>
          <h2 className="section-title">
            技术与软技能
            <span className="gradient-text"> 兼备</span>
          </h2>
          <p className="section-subtitle">
            在不断实践中打磨专业技能，同时注重培养沟通协作和解决问题的能力。
          </p>
        </div>

        <div className="skills__grid">
          {skillCategories.map((category, index) => (
            <div key={index} className="skill-card glass-card">
              <div className="skill-card__header">
                <span className="skill-card__icon">{category.icon}</span>
                <h3 className="skill-card__title">{category.title}</h3>
              </div>
              <p className="skill-card__description">{category.description}</p>
              
              <div className="skill-card__list">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="skill-item">
                    <div className="skill-item__header">
                      <span className="skill-item__name">{skill.name}</span>
                      <span className="skill-item__percent">{skill.level}%</span>
                    </div>
                    <div className="skill-item__bar">
                      <div
                        className="skill-item__bar-fill"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Soft Skills */}
        <div className="skills__soft">
          <h3 className="skills__soft-title">软技能</h3>
          <div className="skills__soft-tags">
            {softSkills.map((skill) => (
              <span key={skill} className="skills__soft-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;
