

import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { IconArrowLeft, IconArrowRight, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import {
  ActionIcon,
  Button,
  Card,
  Center,
  Container,
  Divider,
  Group,
  Image,
  Input,
  NumberInput,
  Select,
  SimpleGrid,
  FileInput,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { zodResolver } from 'mantine-form-zod-resolver';
import { IMaskInput } from 'react-imask';
import { showNotification } from '@mantine/notifications';
import { AxiosError } from 'axios';
import { z } from 'zod';
import { createFormSchema } from '@/types/regularizacaoImobiliario.validation';
import { DateInput , DateInputProps } from '@mantine/dates';
import { createRegularizacao, RegularizacaoData } from '../service/regularizacaoImobiliaria.service';
import { useEffect } from 'react';

export const Cadastro = () => {
  const navigate = useNavigate();

  const regularizacaoMutation = useMutation({
    mutationFn: (data: RegularizacaoData) => createRegularizacao(data),
    onSuccess: async () => {
      showNotification({
        color: 'green',
        title: 'Sucesso!',
        message: 'Seu cadastro foi enviado com sucesso!',
      });
      navigate('/');
    },
    onError: (error: AxiosError) => {
      const responseData = error.response?.data as { message?: string };
      showNotification({
        color: 'red',
        title: 'Erro no Envio',
        message: responseData?.message || 'Ocorreu um erro desconhecido. Tente novamente.',
      });
    },
  });
  const { isPending } = regularizacaoMutation;

  const dateParser = (input: string) => {
    return dayjs(input, 'DD/MM/YYYY').toDate();
  };

  const form = useForm<z.infer<typeof createFormSchema>>({
    initialValues: {
      nomeTitular: '',
      cpfTitular: '',
      rgTitular: '',
      dataNascTitular: null,
      contatoTitular: '',
      profissaoTitular: '',
      escolaridadeTitular: '',
      tituloEleitoralTitular: '',
      cadUnicoTitular: '',
      estadoCivilTitular: '',
      nomeConjuge: '',
      cpfConjuge: '',
      rgConjuge: '',
      dataNascConjuge: null,
      contatoConjuge: '',
      profissaoConjuge: '',
      escolaridadeConjuge: '',
      rendaFamiliar: '',
      acessoBeneficiosSociais: '',
      qualBeneficioSocial: '',
      composicaoFamiliar: [],
      pessoaComDeficienciaFamilia: '',
      quemPessoaComDeficiencia: '',
      loteamento: '',
      loteImovel: '',
      quadraImovel: '',
      tipoLogradouro: '',
      nomeLogradouro: '',
      caracteristicasConstrucao: '',
      outrasCaracteristicasConstrucao: '',
      tempoResidencia: '',
      possuiOutroImovel: '',
      qualOutroImovel: '',
      tipoImovel: '',
      tipoDocumentoOcupacao: '',
      outroTipoDocumentoOcupacao: '',
      observacaoDocumentoOcupacao: '',
      anexosDocumentos: [], 
    },
    validate: zodResolver(createFormSchema),
    validateInputOnBlur: true,
  });

  

  

  useEffect(() => {
    const { composicaoFamiliar } = form.values;
    const ultimoMembro = composicaoFamiliar[composicaoFamiliar.length - 1];

    if (ultimoMembro && ultimoMembro.nome.trim() !== '') {
      form.insertListItem('composicaoFamiliar', { nome: '', parentesco: '', dataNasc: null });
    }
  }, [form.values.composicaoFamiliar]);


  const handleSubmit = (data: RegularizacaoData) => {
    const formData = new FormData();

    const dadosFinais = {
      ...data,
      composicaoFamiliar: data.composicaoFamiliar.filter(membro => membro.nome.trim() !== ''),
    };
    console.log('Dados a serem enviados para a API:', data);
    console.log('Dados a serem enviados para a API:', dadosFinais);

    if (data.anexosDocumentos && data.anexosDocumentos.length > 0) {
      data.anexosDocumentos.forEach((file) => {
        formData.append('anexosDocumentos', file);
      });
    }
    if (data.composicaoFamiliar && data.composicaoFamiliar.length > 0) {
        const membrosFiltrados = data.composicaoFamiliar.filter(
            (membro) => membro.nome && membro.nome.trim() !== ''
        );
        formData.append('composicaoFamiliar', JSON.stringify(membrosFiltrados));
    }

    Object.entries(data).forEach(([key, value]) => {
      // Pula os campos que são arrays e já foram tratados
      if (key === 'anexosDocumentos' || key === 'composicaoFamiliar') {
        return;
      }

      if (value !== null && value !== undefined) {
        // Converte objetos (como datas) para string JSON
        if (typeof value === 'object' && !(value instanceof File)) {
          formData.append(key, JSON.stringify(value));
        } else if (typeof value !== 'object') {
          formData.append(key, String(value));
        }
      }
    });

    const membrosFiltrados = data.composicaoFamiliar.filter(membro => membro.nome && membro.nome.trim() !== '');
    formData.append('composicaoFamiliar', JSON.stringify(membrosFiltrados));

    console.log('Dados a serem enviados via FormData:');
    for (const pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }

    regularizacaoMutation.mutate(data);

  };

  const camposFamiliares = form.values.composicaoFamiliar.map((item, index) => (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} key={index} >
      
      <TextInput
        placeholder="Nome completo do membro"
        {...form.getInputProps(`composicaoFamiliar.${index}.nome`)}
      />
      <TextInput
        placeholder="Parentesco"
        {...form.getInputProps(`composicaoFamiliar.${index}.parentesco`)}
      />
      <DateInput
        placeholder="Data de Nascimento"
        dateParser={dateParser}
        locale='pt-br'
        valueFormat="DD/MM/YYYY"
        {...form.getInputProps(`composicaoFamiliar.${index}.dataNasc`)}
      />
      {/* Botão para remover um membro da lista (exceto o primeiro) */}
      <Center>
      <ActionIcon
        color="red"
        variant="subtle"
        onClick={() => form.removeListItem('composicaoFamiliar', index)}
        disabled={form.values.composicaoFamiliar.length === 1}

      >
        <IconTrash size="1.2rem" />
      </ActionIcon>
      </Center>
    </SimpleGrid>
  ));
  
    
  return (
    <Container size="xl">
      <Stack align="center">
        <Image src={"/Logo/logo.png"} alt="Rank xpert logo" w={200} />
      </Stack>

      <Title order={3} fw={700} tt="uppercase" ta="center" my="lg">
        Formulário de Cadastro
      </Title>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          {/* Seção de Dados do Titular */}
          <Title order={4} c="dimmed" my="md">Dados do Titular</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            <TextInput label="Nome Completo do titular" placeholder="Nome do titular" {...form.getInputProps('nomeTitular')} />
            <Input.Wrapper label="CPF">
              <Input component={IMaskInput} mask="000.000.000-00" placeholder="CPF do titular" {...form.getInputProps('cpfTitular')} />
            </Input.Wrapper>
            <TextInput label="RG" placeholder="RG do titular" {...form.getInputProps('rgTitular')} />
            <DateInput 
              valueFormat="DD/MM/YYYY" 
              dateParser={dateParser}
              locale='pt-br'
              label="Data de Nascimento" 
              placeholder="DD/MM/AAAA" 
              {...form.getInputProps('dataNascTitular')} 
            />
            <Input.Wrapper label="Contato (Telefone)">
              <Input component={IMaskInput} mask="(00) 00000-0000" placeholder="Contato do titular" {...form.getInputProps('contatoTitular')} />
            </Input.Wrapper>
            <TextInput label="Profissão" placeholder="Profissão do titular" {...form.getInputProps('profissaoTitular')} />
            <Select
              label="Escolaridade"
              placeholder="Selecione a escolaridade"
              data={['Analfabeto', 'Fundamental Incompleto', 'Fundamental Completo', 'Médio Incompleto', 'Médio Completo', 'Superior Incompleto', 'Superior Completo', 'Pós-graduação']}
              {...form.getInputProps('escolaridadeTitular')}
            />
            <TextInput label="Título de Eleitor" placeholder="Número do título" {...form.getInputProps('tituloEleitoralTitular')} />
            <TextInput label="Nº CadÚnico" placeholder="Número do Cadastro Único" {...form.getInputProps('cadUnicoTitular')} />
            <Select
              label="Estado Civil"
              placeholder="Selecione o estado civil"
              data={['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União Estável']}
              {...form.getInputProps('estadoCivilTitular')}
            />
          </SimpleGrid>

          {/* Seção de Dados do Cônjuge */}
          {form.values.estadoCivilTitular === 'Casado(a)' || form.values.estadoCivilTitular === 'União Estável' ? (
            <>
              <Divider my="xl" />
              <Title order={4} c="dimmed" my="md">Dados do Cônjuge</Title>
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                <TextInput label="Nome do Cônjuge" placeholder="Nome completo do cônjuge" {...form.getInputProps('nomeConjuge')} />
                <Input.Wrapper label="CPF do Cônjuge">
                    <Input component={IMaskInput} mask="000.000.000-00" placeholder="CPF do cônjuge" {...form.getInputProps('cpfConjuge')} />
                </Input.Wrapper>
                <TextInput label="RG do Cônjuge" placeholder="RG do cônjuge" {...form.getInputProps('rgConjuge')} />
                {/* Alterado para DateInput */}
                <DateInput 
                  valueFormat="DD/MM/YYYY" 
                  label="Data de Nascimento (Cônjuge)" 
                  dateParser={dateParser}
                  locale='pt-br'
                  placeholder="DD/MM/AAAA" 
                  {...form.getInputProps('dataNascConjuge')} 
                />
                <Input.Wrapper label="Contato do Cônjuge">
                    <Input component={IMaskInput} mask="(00) 00000-0000" placeholder="Contato do cônjuge" {...form.getInputProps('contatoConjuge')} />
                </Input.Wrapper>
                <TextInput label="Profissão do Cônjuge" placeholder="Profissão do cônjuge" {...form.getInputProps('profissaoConjuge')} />
                <Select
                  label="Escolaridade do Cônjuge"
                  placeholder="Selecione a escolaridade"
                  data={['Analfabeto', 'Fundamental Incompleto', 'Fundamental Completo', 'Médio Incompleto', 'Médio Completo', 'Superior Incompleto', 'Superior Completo', 'Pós-graduação']}
                  {...form.getInputProps('escolaridadeConjuge')}
                />
              </SimpleGrid>
            </>
          ) : null}

          <Divider my="xl" />

          {/* Seção Socioeconômica e Familiar */}
          <Title order={4} c="dimmed" my="md">Situação Socioeconômica e Familiar</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
             <Select
              label="Renda Familiar"
              placeholder="Selecione a faixa de renda"
              data={[
                'Até 1 salário mínimo (até R$ 1.550,00)',
                'De 1 a 2 salários mínimos (R$ 1.550,01 a R$ 3.100,00)',
                'De 2 a 3 salários mínimos (R$ 3.100,01 a R$ 4.650,00)',
                'De 3 a 5 salários mínimos (R$ 4.650,01 a R$ 7.750,00)',
                'Acima de 5 salários mínimos (acima de R$ 7.750,00)',
                'Nenhuma renda',
              ]}
              {...form.getInputProps('rendaFamiliar')}
            />
             <Select
                label="Acessa Benefícios Sociais?"
                placeholder="Selecione"
                data={['Sim', 'Não']}
                {...form.getInputProps('acessoBeneficiosSociais')}
              />
              {form.values.acessoBeneficiosSociais === 'Sim' && (
                <TextInput label="Qual Benefício?" placeholder="Ex: Bolsa Família" {...form.getInputProps('qualBeneficioSocial')} />
              )}
          </SimpleGrid>

          <Stack mt="md" >
             <Text fz="sm" fw={500}>Composição Familiar (outros membros que residem no imóvel)</Text>
             
             {camposFamiliares}
             <Button
              onClick={() =>
                form.insertListItem('composicaoFamiliar', {
                  nome: '',
                  parentesco: '',
                  dataNasc: null,
                })
              }
              >
              Adicionar Integrante Familiar
            </Button>
          </Stack>
          
          <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
            <Select
              label="Há pessoa com deficiência na família?"
              placeholder="Selecione"
              data={['Sim', 'Não']}
              {...form.getInputProps('pessoaComDeficienciaFamilia')}
            />
            {form.values.pessoaComDeficienciaFamilia === 'Sim' && (
              <TextInput label="Quem?" placeholder="Nome(s) da(s) pessoa(s)" {...form.getInputProps('quemPessoaComDeficiencia')} />
            )}
          </SimpleGrid>


          <Divider my="xl" />

          {/* Seção de Informações do Imóvel */}
          <Title order={4} c="dimmed" my="md">Informações do Imóvel</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
            <TextInput label="Loteamento" placeholder="Nome do loteamento" {...form.getInputProps('loteamento')} />
            <TextInput label="Lote" placeholder="Número do lote" {...form.getInputProps('loteImovel')} />
            <TextInput label="Quadra" placeholder="Número da quadra" {...form.getInputProps('quadraImovel')} />
            <TextInput label="Tempo de Residência" placeholder="Ex: 5 anos" {...form.getInputProps('tempoResidencia')} />
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
             <Select label="Tipo de Logradouro" placeholder="Selecione" data={['Rua', 'Avenida', 'Travessa', 'Viela', 'Outro']} {...form.getInputProps('tipoLogradouro')} />
             <TextInput label="Nome do Logradouro (Endereço)" placeholder="Nome da rua/av." {...form.getInputProps('nomeLogradouro')} />
          </SimpleGrid>
           <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
             <Select
                label="Características da Construção"
                placeholder="Selecione"
                data={['Alvenaria', 'Madeira', 'Mista', 'Outro']}
                {...form.getInputProps('caracteristicasConstrucao')}
              />
              {form.values.caracteristicasConstrucao === 'Outro' && (
                <TextInput label="Outras Características" placeholder="Descreva" {...form.getInputProps('outrasCaracteristicasConstrucao')} />
              )}
          </SimpleGrid>
          <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
              <Select
                label="Possui outro imóvel?"
                placeholder="Selecione"
                data={['Sim', 'Não']}
                {...form.getInputProps('possuiOutroImovel')}
              />
              {form.values.possuiOutroImovel === 'Sim' && (
                <TextInput label="Onde?" placeholder="Cidade/Estado do outro imóvel" {...form.getInputProps('qualOutroImovel')} />
              )}
          </SimpleGrid>
          
          <Divider my="xl" />

          {/* Seção de Documentação */}
          <Title order={4} c="dimmed" my="md">Documentação de Posse/Ocupação</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
             <Select label="Tipo de Imóvel" placeholder="Selecione" data={['Próprio', 'Alugado', 'Cedido', 'Ocupação']} {...form.getInputProps('tipoImovel')} />
             <Select
                label="Documento de Ocupação"
                placeholder="Selecione"
                data={['Contrato de Compra e Venda', 'Recibo', 'Termo de Doação', 'Matrícula', 'Outro']}
                {...form.getInputProps('tipoDocumentoOcupacao')}
              />
              {form.values.tipoDocumentoOcupacao === 'Outro' && (
                <TextInput label="Qual Outro Documento?" placeholder="Descreva o documento" {...form.getInputProps('outroTipoDocumentoOcupacao')} />
              )}
          </SimpleGrid>
          <SimpleGrid cols={1} mt="md">
             {/* Alterado para DateInput */}
             
             <Textarea label="Observações sobre o Documento" placeholder="Detalhes adicionais" {...form.getInputProps('observacaoDocumentoOcupacao')} />
          </SimpleGrid>

          
          <FileInput
            label="Anexar Documentos"
            placeholder="Clique para escolher um ou mais arquivos"
            description="É possível anexar múltiplos arquivos."
            clearable
            multiple // Permite a seleção de múltiplos arquivos
            {...form.getInputProps('anexosDocumentos')}
          />


          <Group justify="flex-end" mt="xl" >
            
            <Button
              disabled={!form.isValid()}
              rightSection={<IconArrowRight size="1.5rem" />}
              color="blue"
              type="submit"
              loading={isPending}
              
            >
              Enviar Cadastro
            </Button>
          </Group>
        </form>
      </Card>
    </Container>
    );
};
export default Cadastro;