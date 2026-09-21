import { AjustarJuridico, LegalShell, Secao } from "../components/LegalShell";
import { CONTATO_SUPORTE, mailto } from "../config/contato";

/**
 * Termos de Uso.
 *
 * Mesma regra da Política de Privacidade: o que descreve o funcionamento
 * real da plataforma está escrito; o que cria obrigação contratual está
 * marcado para o jurídico. Cláusula de responsabilidade, SLA e foro não
 * são decisões de design.
 */
export default function TermosPage() {
  return (
    <LegalShell
      titulo="Termos de Uso"
      resumo="Condições de acesso e uso da plataforma PIPADriven pelas incorporadoras, imobiliárias e usuários autorizados."
    >
      <Secao n="01" titulo="O que é a plataforma">
        <p className="m-0">
          A PIPADriven é uma plataforma de inteligência comercial para incorporadoras e
          imobiliárias. Centraliza a jornada do lead, dá visibilidade sobre o funil e sobre a rede de
          corretores parceiros, e transforma esses registros em indicadores de decisão.
        </p>
        <p className="m-0">
          A plataforma é uma ferramenta de apoio à gestão. As decisões comerciais — preço, desconto,
          distribuição de leads, contratação de parceiros — permanecem integralmente da contratante.
        </p>
      </Secao>

      <Secao n="02" titulo="Quem pode acessar">
        <p className="m-0">
          O acesso é nominal e concedido pelo administrador da conta da contratante. Cada credencial
          pertence a uma pessoa e não deve ser compartilhada. O usuário é responsável por manter a
          confidencialidade da sua senha e por comunicar imediatamente qualquer uso não autorizado.
        </p>
        <p className="m-0">
          A contratante é responsável por revogar acessos de pessoas desligadas e por garantir que
          cada usuário tenha o perfil adequado à sua função.
        </p>
      </Secao>

      <Secao n="03" titulo="Uso aceitável">
        <p className="m-0">É vedado ao usuário:</p>
        <ul className="m-0 flex list-disc flex-col gap-2 pl-5">
          <li>extrair dados em massa por meios automatizados sem autorização expressa;</li>
          <li>tentar acessar dados de outra conta de cliente;</li>
          <li>usar dados pessoais obtidos na plataforma para finalidade estranha à operação comercial contratada;</li>
          <li>realizar engenharia reversa, cópia ou redistribuição da plataforma;</li>
          <li>interferir na disponibilidade ou na integridade do serviço.</li>
        </ul>
      </Secao>

      <Secao n="04" titulo="Dados da operação">
        <p className="m-0">
          Os dados comerciais inseridos ou gerados na plataforma pertencem à contratante. A
          PIPADriven os trata como operadora, nos termos da{" "}
          <a
            href="/privacidade"
            className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4"
          >
            Política de Privacidade
          </a>
          .
        </p>
        <AjustarJuridico>
          Definir o formato e o prazo de devolução ou eliminação dos dados ao término do contrato.
        </AjustarJuridico>
      </Secao>

      <Secao n="05" titulo="Disponibilidade e suporte">
        <p className="m-0">
          Atualizações e manutenções podem exigir interrupções programadas, comunicadas com
          antecedência sempre que possível. Para registrar um problema:{" "}
          <a
            href={mailto(CONTATO_SUPORTE, "Suporte PIPADriven")}
            className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4"
          >
            {CONTATO_SUPORTE}
          </a>
          .
        </p>
        <AjustarJuridico>
          Definir o SLA contratual — disponibilidade mensal, janela de atendimento, prazos de
          resposta por severidade e eventual compensação.
        </AjustarJuridico>
      </Secao>

      <Secao n="06" titulo="Módulos e funcionalidades">
        <p className="m-0">
          A plataforma é modular. Os módulos ativos em cada conta são os previstos no contrato.
          Módulos apresentados no painel como em preparação não integram o escopo contratado até que
          sejam formalmente ativados, e sua descrição não constitui promessa de entrega em prazo
          determinado.
        </p>
      </Secao>

      <Secao n="07" titulo="Limitação de responsabilidade">
        <AjustarJuridico>
          Redigir a cláusula de limitação de responsabilidade, as exclusões aplicáveis e o teto
          indenizatório. Esta seção não pode ser preenchida sem análise jurídica.
        </AjustarJuridico>
      </Secao>

      <Secao n="08" titulo="Vigência, alterações e foro">
        <AjustarJuridico>
          Definir vigência, condições de rescisão, procedimento de alteração dos termos e foro de
          eleição.
        </AjustarJuridico>
      </Secao>
    </LegalShell>
  );
}
