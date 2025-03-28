import { Divider, Paper, Stack, Typography } from "@mui/material";

function AboutUs() {
  return(
    <Paper elevation={3} sx={{alignItems:'center', justifyContent:'center', p:1, m:1, border:1, borderColor:'divider' }} >

        <Stack direction='row' sx={{ alignItems:'center' }}>
          <Typography variant='h4' sx={{ m:2, textDecoration:'underline'}}  >
            <b>ComBoox Software License 1.0 </b> 
          </Typography>
        </Stack>

        <Typography variant='h5' sx={{ m:2  }}  >
          <b>TERMS AND CONDITIONS FOR USE, REPRODUCTION AND DISTRIBUTION.</b>
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          <b>1. Definition</b>
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          <b>&quot;Contributor&quot;</b> shall mean copyright owner, and the other contribution owner and any individual or Legal Entity who have submitted the Work to the Copyright Owner and subsequently incorporated within the Work. 
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          <b>&quot;Contribution&quot;</b> shall mean the original version of the Work and any additions to that Work, that is intentionally submitted to Contributor for inclusion in the Work by the copyright owner or by an individual or Legal Entity authorized to submit on behalf of the copyright owner.
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          <b>&quot;Legal Entity&quot;</b> shall mean the union of the acting entity and all other entities that control, are controlled by, or are under common control with that entity. For the purposes of this definition, &quot;control&quot; means (i) the power, direct or indirect, to cause the direction or management of such entity, whether by contract or otherwise, or (ii) ownership of fifty percent (50%) or more of the outstanding shares, or (iii) beneficial ownership of such entity.
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          <b>&quot;License&quot;</b> shall mean the terms and conditions for the permitted use as defined by this document.
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          <b>&quot;Licensor&quot;</b> shall mean the copyright owner and/or Legal Entity authorized by the copyright owner that is granting the License.
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          <b>&quot;Permitted Use&quot;</b> shall mean the acts of calling the smart contracts of ComBoox via their specific API to read or write data on the blockchain network where they were originally deployed by Contributor, and the acts of reproduction, distribution or presentation of the Work for purposes of research, verification or testing, on a computer not linking with any blockchain network, or on a local testing blockchain that consists of one or more nodes entirely and exclusively controlled by You.
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          <b>&quot;Work&quot;</b> or <b>&quot;ComBoox&quot;</b> shall mean the ComBoox system, a blockchain based statutory books keeping system, consisting of a series of smart contracts, including all Contribution(s).
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          <b>&quot;You&quot;</b> shall mean an individual or Legal Entity exercising permissions granted by this License.
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          <b>2. Grant of License</b>
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          Subject to the terms and conditions of this License, each Contributor hereby grants to you a worldwide, non-exclusive copyright License for the Permitted Use of Work.
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          <b>3. No Trademark License </b>
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          No trademark license is granted to use the trade names, trademarks of Contributor, except as required for reasonable and customary use in describing the origin of the Work.
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          <b>4. Prohibition </b>
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          Unless expressly permitted in this License or other agreements, You are prohibited from: 
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
         (1)Deploying the smart contracts of ComBoox, in whole or in part, for whatever purpose, on any blockchain network that has one or more nodes out of your control;
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
         (2)Modifying, translating, or creating derivative works based on the Work; or
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
         (3)Using or disposing of the Work in any illegal manner.
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          <b>5. Additional Terms </b>
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
         (1)If you intend to use the Licensed Work in a way that does not fully comply with the requirements stipulated in this License, please contact Contributor in advance to apply for a commercial license.
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
         (2)The Permitted Use and any Contributions to the Work must include a readable copy of this License (refer to the section below on Special Requirements On Reproduction or Distribution). 
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          <b>6. Termination</b>
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          Any use of the Work in violation of this License will automatically terminate your rights under this License for the current and all other Work.
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          <b>7. Disclaimer of Warranty</b>
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
        (1)Contributor provides the Work (and each Contributor provides its Contributions) on an <b>&quot;AS IS&quot; BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT, MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE. IN NO EVENT SHALL ANY CONTRIBUTOR BE LIABLE TO YOU FOR ANY DAMAGES, INCLUDING, BUT NOT LIMITED TO ANY DIRECT, OR INDIRECT, SPECIAL OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OR INABILITY TO USE THE WORK OR THE CONTRIBUTION, NO MATTER HOW IT&apos;S CAUSED OR BASED ON WHICH LEGAL THEORY, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</b>
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
        (2)Although ComBoox provides some valuable Legal and Compliance solutions, whereas, it cannot ensure absolute compliance for any significant legal issues, please seek professional advice from legal experts of the relevant jurisdictions. <b>IN NO EVENT SHALL ANY CONTRIBUTOR BE LIABLE FOR ANY DAMAGES</b> caused by below issues:
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'4em', marginRight:'4em' }}  >
        i.AML/KYC Compliance: shall mean the mandatory legal requirements about identity verification and identity archives management, that various countries stipulated in the fields of financing, securities, investment, asset management, currency exchange, payment etc., for the purpose of investor suitability protection, anti-money laundering, anti-terrorist financing, anti-tax avoidance, and other related purposes,
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'4em', marginRight:'4em' }}  >
        ii.Securities Compliance: shall mean the mandatory legal requirements around securities issuance and/or transaction activities (such as reporting, filing, and disclosure) for the securities-type equity public offerings or specified private placement in terms of stocks, bonds, and other financing instruments in various countries; or
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'4em', marginRight:'4em' }}  >
        iii.Data Compliance: shall mean the mandatory legal requirements for data processing activities in various countries, in order to protecting data security, personal information rights, national security and/or commercial secrets.
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
        (3)As an infrastructure software, ComBoox cannot influence or control any behavior of its users or third parties. <b>IN NO EVENT SHALL ANY CONTRIBUTOR BE LIABLE FOR ANY DAMAGES</b> caused by below third party behavior:
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'4em', marginRight:'4em' }}  >
        i.Inaccurate, incomplete or untimely data uploaded/provided by users;
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'4em', marginRight:'4em' }}  >
        ii.A third party malicious attack, hack, tamper, intercept, or controls over the data against its owner&apos;s intention; or
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'4em', marginRight:'4em' }}  >
        iii.The unavailability of the blockchain due to the failure of any external environment supplier, such as the unavailability of electrical power, internet connection, and/or any other similar public utilities or infrastructures failure caused by third parties&apos; behavior or negligence.
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          <b>8. Language</b>
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
        This License is written in English and Chinese, both shall have the same legal effect. In case of any discrepancies between the two versions, the English one shall prevail.
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          <b>9. Special Requirements On Reproduction or Distribution</b>
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
        To reproduce or distribute this WORK, you are required to complete following steps:
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
        (1)Create a file named <b>&quot;LICENSE&quot;</b> which contains the whole context of this License in the first directory of your package;
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
        (2)Attach the statement to the appropriate annotated syntax at the beginning of each source file.
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
        This <b>WORK</b> is licensed under ComBoox SoftWare License 1.0, a copy of which can be obtained at:    
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
        [https://github.com/paul-lee-attorney/comboox]      
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
        <b>THIS WORK IS PROVIDED ON AN &quot;AS IS&quot; BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT, MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE. IN NO EVENT SHALL ANY CONTRIBUTOR BE LIABLE TO YOU FOR ANY DAMAGES.</b>
        <br/>
        <b>YOU ARE PROHIBITED FROM DEPLOYING THE SMART CONTRACTS OF THIS WORK, IN WHOLE OR IN PART, FOR WHATEVER PURPOSE, ON ANY BLOCKCHAIN NETWORK THAT HAS ONE OR MORE NODES THAT ARE OUT OF YOUR CONTROL.</b>
        </Typography>

        <Divider orientation="horizontal" />

        <Stack direction='row' sx={{ alignItems:'center' }}>
          <Typography variant='h4' sx={{ m:2, textDecoration:'underline'  }}  >
            <b>ComBoox软件许可证 1.0</b> 
          </Typography>
        </Stack>

        <Typography variant='h5' sx={{ m:2  }}  >
          <b>您对ComBoox的使用、复制及分发受ComBoox软件许可证如下条款的约束:</b>
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          <b>1. 定义</b>
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          <b>&quot;贡献者&quot;</b> 指版权所有者, 以及向版权所有者提交作品, 且该作品被版权所有者接受和纳入的贡献所有者及其合法授权的自然人或法人实体。 
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          <b>&quot;贡献&quot;</b> 指作品的原始版本, 以及由版权所有者,或合法授权主体代表版权所有者提交给贡献者, 并包含在作品中的任何补充内容。
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          <b>&quot;法人实体&quot;</b> 指行为实体以及控制该实体、受该实体控制或与该实体共同控制的所有其他实体的关联方。就本定义而言,  “控制” 是指 (i) 无论是通过合同还是其他方式直接或间接领导或管理该实体的权力, 或 (ii) 拥有百分之五十 (50%) 或更多已发行股权份额, 或 (iii) 该实体的实控人。
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          <b>&quot;许可证&quot;</b> 指本文档为被允许的使用所定义的条款和条件。
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          <b>&quot;许可方&quot;</b> 指版权所有者, 和/或版权所有者授权的授予许可的实体。
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          <b>&quot;被允许的使用&quot;</b> 指通过特定API调用ComBoox的智能合约,在贡献者最初部署的区块链网络上读取或写入数据的行为, 以及在不与任何区块链网络连接的计算机上, 或在由您完全排他控制的一个或多个节点构成的本地测试区块链上, 出于研究、验证和测试等目的复制、分发或演示作品的行为。
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          <b>&quot;作品&quot;</b> 或 <b>&quot;ComBoox&quot;</b> 指 ComBoox 系统, 一个基于区块链技术的公司治理文件簿记系统, 由一系列智能合约组成, 包括相关的所有贡献。
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          <b>&quot;您&quot;</b> 指行使本许可证授予的权限的个人或法人实体。
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          <b>2. 授予许可证</b>
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
         根据本许可证的条款和条件, 贡献者特此向您授予一份全球范围内的非独占版权许可证, 以被允许的使用方式使用作品。
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          <b>3. 无商标许可</b>
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          贡献者不提供对贡献者的商品名称、商标的商标许可, 但出于描述作品来源的合理和习惯使用的需要除外。
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          <b>4. 禁止</b>
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
          除非本许可证或其他协议书面允许, 您不得：
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
         (1)在含有您无法控制的一个或多个节点的区块链网络上部署 ComBoox 的智能合约, 不论是部署全部还是部分合约, 不论您出于何种目的；
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
         (2)修改、改变或创作该作品的衍生作品；或
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
         (3)以任何非法方式使用或处分本作品。
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          <b>5. 附加条款</b>
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
        (1)如果您打算以超出本许可证允许的方式使用作品, 请提前联系贡献者申请商业许可。
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
        (2)本作品的被允许的使用和贡献必须包括本许可证的可读副本（请参阅下文中有关复制或分发的特殊要求的部分）。
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          <b>6. 终止</b>
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
        任何违反本许可证使用本作品的行为, 将导致您在本许可证下对当前作品和所有其他衍生作品的权利自动终止。
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          <b>7. 免责声明</b>
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
        (1)贡献者以“按现状”原则提供本作品（并且每个贡献者也是以“按现状”原则提供其贡献），不提供任何类型的明示或暗示的保证或条件，在任何情况下，任何贡献者均不对您承担任何损害赔偿责任，包括但不限于因您使用或无法使用本作品或贡献而产生的任何直接或间接、特殊或后果性损害责任，无论出于任何原因或基于何种法律理论，即使已被告知发生此类损害的可能性。
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
        (2)尽管 ComBoox 提供了有价值的法律和合规解决方案， 但是ComBoox不能根本解决任何一项法律合规问题, 请寻求相关司法管辖区法律专家的专业意见。在任何情况下, 任何贡献者均不对以下问题造成的任何损害承担责任：
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'4em', marginRight:'4em' }}  >
        i.反洗钱合规：指各国出于保证投资者适当性、反洗钱、反恐融资、反避税, 以及其他相关目的, 在证券、投资、融资、资产管理、外币兑换、款项支付等领域, 针对行为主体身份识别与身份信息管理等问题提出的强制性法律要求；
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'4em', marginRight:'4em' }}  >
        ii.证券合规：指各国为保护投资者权益, 对于股票、债券、融资工具等面向不特定主体或超过一定数量的特定主体, 发行或交易证券类权益凭证所规定的, 提前申报、备案及信息披露等强制性法律要求；或
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'4em', marginRight:'4em' }}  >
        iii.数据合规：指各国为保护数据安全、个人信息权、国家安全和/或商业秘密而对信息和数据处理活动提出的强制性法律要求。
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
        (3)作为基础设施软件,ComBoox无法影响或控制其使用者或第三方的任何行为。在任何情况下,任何贡献者均不对以下第三方造成的任何损害承担责任：
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'4em', marginRight:'4em' }}  >
        i.使用者上传/提供的数据不准确、不完整或不及时；
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'4em', marginRight:'4em' }}  >
        ii.第三方通过技术手段进行恶意攻击、黑客入侵、篡改、拦截或违背使用者的意图操纵数据；或
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'4em', marginRight:'4em' }}  >
        iii.任何外部环境故障而导致区块链不可访问的情形, 例如电力、网络和/或其他公共基础设施由于第三方作为或不作为而导致的故障等情形。
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          <b>8. 语言</b>
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
        本许可证以中文和英文书就, 两种语言版本具有同等法律效力。如果两种语言版本之间存在任何差异, 则以英文版本为准。
        </Typography>

        <Typography variant='h5' sx={{ m:2 }}  >
          <b>9. 复制或分发的特殊要求</b>
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
        如预复制或分发此作品, 您需要完成以下步骤：
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
        (1)在安装包的第一个目录中创建一个名为“LICENSE”的文件,以包含本许可证全部内容;
        </Typography>

        <Typography variant='h6' sx={{ marginLeft:'2em', marginRight:'2em' }}  >
        (2)用适当的带注释语法将下列语句附加到每个源文件开头。
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
        This <b>WORK</b> is licensed under <b>ComBoox SoftWare License 1.0</b>, a copy of which can be obtained at:    
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
        [https://github.com/paul-lee-attorney/comboox]      
        </Typography>

        <Typography variant='h6' sx={{ m:2 }}  >
        <b>THIS WORK IS PROVIDED ON AN &quot;AS IS&quot; BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT, MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE. IN NO EVENT SHALL ANY CONTRIBUTOR BE LIABLE TO YOU FOR ANY DAMAGES.</b>
        <br/>
        <b>YOU ARE PROHIBITED FROM DEPLOYING THE SMART CONTRACTS OF THIS WORK, IN WHOLE OR IN PART, FOR WHATEVER PURPOSE, ON ANY BLOCKCHAIN NETWORK THAT HAS ONE OR MORE NODES THAT ARE OUT OF YOUR CONTROL.</b> 
        </Typography>

    </Paper>        
  );
}

export default AboutUs;

