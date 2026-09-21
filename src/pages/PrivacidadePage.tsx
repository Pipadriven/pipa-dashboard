import { AjustarJuridico, LegalShell, Secao } from "../components/LegalShell";
import { CONTATO_PRIVACIDADE, mailto } from "../config/contato";

/**
 * Política de Privacidade.
 *
 * As seções factuais descrevem o que a plataforma realmente faz — quais
 * dados trafegam, onde ficam, quem acessa. As decisões jurídicas (prazos
 * de retenção, base legal, foro, encarregado) ficam marcadas para revisão:
 * são compromissos legais, não texto de interface.
 */
export default function PrivacidadePage() {
  return (
    <LegalShell
      titulo="Política de Privacidade"
      resumo="Como a PIPADriven trata os dados pessoais que circulam na plataforma, em conformidade com a Lei nº 13.709/2018 (LGPD)."
    >
      <Secao n="01" titulo="Quem é o controlador">
        <p className="m-0">
          Na operação da PIPADriven existem dois papéis distintos. A{" "}
          <strong className="text-foreground">incorporadora ou imobiliária contratante</strong> é a
          controladora dos dados de seus leads, clientes e corretores: é ela quem decide por que e
          como esses dados são tratados. A <strong className="text-foreground">PIPADriven</strong>{" "}
          atua como operadora, tratando os dados em nome da contratante e conforme suas instruções.
        </p>
        <AjustarJuridico>
          Confirmar a qualificação dos papéis e anexar o contrato de operador (DPA) firmado com cada
          contratante.
        </AjustarJuridico>
      </Secao>

      <Secao n="02" titulo="Quais dados a plataforma trata">
        <p className="m-0">
          <strong className="text-foreground">De quem usa o painel:</strong> endereço de e-mail,
          senha criptografada, identificador da conta e registros de acesso.
        </p>
        <p className="m-0">
          <strong className="text-foreground">Da operação comercial:</strong> dados de leads e
          clientes (nome, telefone, histórico de contato), dados de corretores parceiros (nome,
          imobiliária, telefone, atividade registrada), visitas agendadas e realizadas, reservas de
          unidades e pedidos de exceção comercial.
        </p>
        <p className="m-0">
          A plataforma não coleta dados sensíveis conforme o art. 5º, II da LGPD, e não realiza
          decisão automatizada com efeito jurídico sobre titulares.
        </p>
      </Secao>

      <Secao n="03" titulo="Para que os dados são usados">
        <p className="m-0">
          Exclusivamente para operar a jornada comercial contratada: centralizar o funil, distribuir
          leads à rede de parceiros, registrar atendimento e visitas, e produzir os indicadores
          exibidos no painel. Os dados não são vendidos, cedidos ou usados para publicidade de
          terceiros.
        </p>
        <AjustarJuridico>
          Declarar a base legal de cada finalidade — execução de contrato, legítimo interesse ou
          consentimento — e o teste de legítimo interesse quando aplicável.
        </AjustarJuridico>
      </Secao>

      <Secao n="04" titulo="Com quem os dados são compartilhados">
        <p className="m-0">
          Com os corretores parceiros designados para atender cada lead, e com os prestadores de
          infraestrutura necessários ao funcionamento: provedor de banco de dados e autenticação
          (Supabase), provedor de mensageria em nuvem e provedor de hospedagem.
        </p>
        <AjustarJuridico>
          Listar nominalmente cada suboperador, o país de hospedagem e a salvaguarda adotada para
          transferência internacional, se houver.
        </AjustarJuridico>
      </Secao>

      <Secao n="05" titulo="Por quanto tempo ficam armazenados">
        <AjustarJuridico>
          Definir o prazo de retenção por categoria de dado — lead não convertido, cliente ativo,
          corretor desligado, registro de acesso — e o procedimento de eliminação ao fim do contrato.
        </AjustarJuridico>
      </Secao>

      <Secao n="06" titulo="Direitos do titular">
        <p className="m-0">
          Qualquer titular pode solicitar confirmação de tratamento, acesso, correção, anonimização,
          portabilidade, eliminação e informação sobre compartilhamentos, nos termos do art. 18 da
          LGPD. Pedidos sobre dados de leads e clientes devem ser dirigidos à incorporadora
          controladora; a PIPADriven apoia o atendimento como operadora.
        </p>
        <p className="m-0">
          Para questões sobre esta política:{" "}
          <a
            href={mailto(CONTATO_PRIVACIDADE, "Solicitação LGPD")}
            className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4"
          >
            {CONTATO_PRIVACIDADE}
          </a>
          .
        </p>
        <AjustarJuridico>
          Nomear formalmente o encarregado pelo tratamento de dados (DPO) e publicar sua
          identidade e contato, conforme art. 41 da LGPD.
        </AjustarJuridico>
      </Secao>

      <Secao n="07" titulo="Segurança">
        <p className="m-0">
          O acesso ao painel exige autenticação individual, o tráfego é cifrado em trânsito e a
          visibilidade dos dados é restrita por conta de cliente. Senhas são armazenadas apenas em
          forma criptografada e não são acessíveis à equipe da PIPADriven.
        </p>
        <AjustarJuridico>
          Descrever o plano de resposta a incidentes e o prazo de comunicação à ANPD e aos titulares.
        </AjustarJuridico>
      </Secao>

      <Secao n="08" titulo="Alterações desta política">
        <p className="m-0">
          Mudanças relevantes serão comunicadas aos contratantes antes de entrarem em vigor, e a data
          de vigência no topo desta página será atualizada.
        </p>
      </Secao>
    </LegalShell>
  );
}
